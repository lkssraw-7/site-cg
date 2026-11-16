"""Export the existing raster mark as white alpha artwork; no redrawing.
Run from the project root. The tagline is outside the website lockup crop.
"""
from pathlib import Path
import numpy as np
from PIL import Image

source = Path('public/logos/cordeiro-group.png')
original = Image.open(source).convert('RGB')
# Includes every edge of the original mark and wordmark, with minimal padding.
rgb = np.asarray(original.crop((380, 258, 2064, 600)), dtype=np.float32)
contrast = 255 - rgb
bases = np.array([[107, 128, 155], [237, 128, 25]], dtype=np.float32)
vectors = 255 - bases
alphas = np.stack([(contrast @ v) / (v @ v) for v in vectors], axis=-1)
errors = np.stack([np.linalg.norm(contrast - alphas[..., i, None] * v, axis=-1) for i, v in enumerate(vectors)], axis=-1)
choice = errors.argmin(axis=-1)
alpha = np.take_along_axis(alphas, choice[..., None], axis=-1)[..., 0]
# Where the two opaque brand colors meet, their blend is also opaque.
alpha[(errors.min(axis=-1) > 6) & (rgb.min(axis=-1) < 220)] = 1
alpha = np.clip(np.rint(alpha * 255), 0, 255).astype(np.uint8)
mask = Image.fromarray(alpha).resize((4096, 832), Image.Resampling.LANCZOS)
result = Image.new('RGBA', mask.size, (255, 255, 255, 255))
result.putalpha(mask)
path = Path('public/logos/cordeiro-group-white-hd.png')
result.save(path, optimize=True)
preview = Image.new('RGBA', result.size, '#17212c')
preview.alpha_composite(result)
preview.convert('RGB').save('output/branding/cordeiro-group-white-preview.png', optimize=True)
print(path, result.size, f'{path.stat().st_size:,} bytes')
print('Alpha range:', result.getchannel('A').getextrema(), 'content bounds:', result.getbbox())
