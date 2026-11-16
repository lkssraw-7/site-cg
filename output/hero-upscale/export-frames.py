#!/usr/bin/env python3
"""User-approved deterministic 4K upscale; never modifies the original assets."""
import argparse
from concurrent.futures import ThreadPoolExecutor, wait, FIRST_COMPLETED
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import time

from PIL import Image, ImageFilter, features


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--first", type=int, default=14)
    parser.add_argument("--last", type=int, default=240)
    parser.add_argument("--mapping", type=Path, help="Verified output-frame to source-index mapping")
    args = parser.parse_args()
    if not features.check("webp"):
        raise RuntimeError("Pillow with WebP support is required")
    info = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=width,height", "-of", "json", str(args.source),
    ]))["streams"][0]
    size = (info["width"], info["height"])
    if size != (2560, 1440):
        raise ValueError(f"Unexpected source dimensions: {size}")
    for variant in ("2k", "4k"):
        (args.output / variant).mkdir(parents=True, exist_ok=True)

    rows = json.loads(args.mapping.read_text()) if args.mapping else [
        {"output_frame": n, "source_index": n - 1} for n in range(args.first, args.last + 1)
    ]
    rows = [row for row in rows if args.first <= row["output_frame"] <= args.last]
    assert [row["output_frame"] for row in rows] == list(range(args.first, args.last + 1))
    outputs_by_source = {}
    for row in rows:
        outputs_by_source.setdefault(row["source_index"], []).append(row["output_frame"])
    source_first, source_last = min(outputs_by_source), max(outputs_by_source)

    def export(numbers, pixels):
        original = Image.frombytes("RGB", size, pixels)
        enlarged = original.resize((3840, 2160), Image.Resampling.LANCZOS)
        sharpened = enlarged.filter(ImageFilter.UnsharpMask(radius=1.1, percent=25, threshold=3))
        name = f"ezgif-frame-{numbers[0]:03d}.webp"
        for variant, image in (("2k", original), ("4k", sharpened)):
            destination = args.output / variant / name
            temporary = destination.with_suffix(".webp.tmp")
            image.save(temporary, format="WEBP", quality=90, method=4)
            temporary.replace(destination)
            for number in numbers[1:]:
                shutil.copyfile(destination, args.output / variant / f"ezgif-frame-{number:03d}.webp")
        original.close()
        enlarged.close()
        sharpened.close()
        return len(numbers)

    started = time.monotonic()
    frame_bytes = size[0] * size[1] * 3
    count = args.last - args.first + 1
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(args.source),
        "-vf", f"select=between(n\\,{source_first}\\,{source_last})",
        "-fps_mode", "passthrough", "-frames:v", str(source_last - source_first + 1),
        "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
    ]
    completed = 0
    with subprocess.Popen(command, stdout=subprocess.PIPE) as decoder, ThreadPoolExecutor(max_workers=2) as pool:
        pending = set()
        for source_index in range(source_first, source_last + 1):
            pixels = decoder.stdout.read(frame_bytes)
            if len(pixels) != frame_bytes:
                raise RuntimeError(f"Incomplete source frame {source_index}: {len(pixels)} bytes")
            if source_index not in outputs_by_source:
                continue
            pending.add(pool.submit(export, outputs_by_source[source_index], pixels))
            # Keep memory bounded instead of retaining every decoded frame.
            if len(pending) >= 3:
                done, pending = wait(pending, return_when=FIRST_COMPLETED)
                completed += sum(job.result() for job in done)
                if completed % 20 == 0:
                    print(f"Exported {completed}/{count} frames in both resolutions", flush=True)
        for job in pending:
            job.result()
        if decoder.wait() != 0:
            raise RuntimeError("Video decoding failed")

    report = {
        "source": args.source.name,
        "source_sha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
        "first_frame": args.first,
        "last_frame": args.last,
        "frame_count_per_variant": count,
        "source_mapping": rows,
        "method": "Original video frames; Lanczos 1.5x; UnsharpMask radius 1.1, percent 25, threshold 3; WebP quality 90, method 4",
        "variants": {},
        "elapsed_seconds": round(time.monotonic() - started, 1),
    }
    for variant, expected in (("2k", (2560, 1440)), ("4k", (3840, 2160))):
        paths = [args.output / variant / f"ezgif-frame-{n:03d}.webp" for n in range(args.first, args.last + 1)]
        for path in paths:
            with Image.open(path) as image:
                assert image.size == expected, path
                image.verify()
        report["variants"][variant] = {"width": expected[0], "height": expected[1], "bytes": sum(p.stat().st_size for p in paths)}
    (args.output / "manifest.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({key: value for key, value in report.items() if key != "source_mapping"}, indent=2), flush=True)


if __name__ == "__main__":
    main()
