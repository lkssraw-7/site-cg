export const GLOBE_SCALE = .97;
export const MARKER_ELEVATION = .008;
const radians = Math.PI / 180;
export const AMERICAS = { phi: -15 * radians, theta: 10 * radians };
export type GlobeView = { phi: number; theta: number };

export function focusLocation([latitude, longitude]: readonly [number, number]): GlobeView {
  return { phi: -Math.PI / 2 - longitude * radians, theta: latitude * radians };
}

export function nearestAngle(target: number, current: number) {
  return current + Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

/** Matches COBE 2.0.1's orthographic marker projection; no CSS anchor dependency. */
export function projectLocation([lat, lon]: readonly [number, number], { phi, theta }: GlobeView) {
  const radius = .8 + MARKER_ELEVATION;
  const latitude = lat * radians, longitude = lon * radians - Math.PI;
  const x = -Math.cos(latitude) * Math.cos(longitude) * radius;
  const y = Math.sin(latitude) * radius;
  const z = Math.cos(latitude) * Math.sin(longitude) * radius;
  const rx = Math.cos(phi) * x + Math.sin(phi) * z;
  const ry = Math.sin(phi) * Math.sin(theta) * x + Math.cos(theta) * y - Math.cos(phi) * Math.sin(theta) * z;
  const rz = -Math.sin(phi) * Math.cos(theta) * x + Math.sin(theta) * y + Math.cos(phi) * Math.cos(theta) * z;
  return { x: (rx * GLOBE_SCALE + 1) / 2, y: (-ry * GLOBE_SCALE + 1) / 2, visible: rz > .015 };
}

/** Separate labels into two rails, spreading crowded points without overlap. */
export function spreadLabels<T extends { y: number }>(points: T[], size: number) {
  const sorted = [...points].sort((a, b) => a.y - b.y);
  const gap = 34 / Math.max(size, 1), low = .12, high = .88;
  const placed = sorted.map((point, index) => ({ ...point, labelY: Math.max(low + index * gap, Math.min(high, point.y)) }));
  for (let i = 1; i < placed.length; i++) placed[i].labelY = Math.max(placed[i].labelY, placed[i - 1].labelY + gap);
  for (let i = placed.length - 1; i >= 0; i--) placed[i].labelY = Math.min(placed[i].labelY, i === placed.length - 1 ? high : placed[i + 1].labelY - gap);
  return placed;
}

/** Pointer movement is relative to the drag origin, never to page scroll. */
export function dragGlobeView(origin: GlobeView, dx: number, dy: number, size: number, touch: boolean): GlobeView {
  return {
    phi: origin.phi + dx / Math.max(180, size * .55),
    theta: Math.max(-1.1, Math.min(1.1, origin.theta + (touch ? 0 : dy / Math.max(1, size)))),
  };
}
