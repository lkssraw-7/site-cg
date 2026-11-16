export type Country = {
  id: string;
  name: string;
  location: [number, number];
  side: 'left' | 'right';
  fallback: [number, number];
};

// Representative country markers, not offices or exact project addresses.
// Brazil uses the conceptual origin in Indaiatuba, as in the approved design.
export const presenceCountries: Country[] = [
  { id: 'brasil', name: 'Brasil', location: [-23.09, -47.22], side: 'right', fallback: [460.03, 473.72] },
  { id: 'argentina', name: 'Argentina', location: [-34.6, -64.2], side: 'right', fallback: [385.73, 519.38] },
  { id: 'chile', name: 'Chile', location: [-30.5, -71.3], side: 'left', fallback: [358.16, 503.77] },
  { id: 'peru', name: 'Peru', location: [-9.2, -75.0], side: 'left', fallback: [339.78, 411.16] },
  { id: 'colombia', name: 'Colômbia', location: [4.6, -74.3], side: 'left', fallback: [349.21, 349.2] },
  { id: 'guatemala', name: 'Guatemala', location: [15.5, -90.3], side: 'left', fallback: [270.79, 293.78] },
  { id: 'dominicana', name: 'República Dominicana', location: [18.8, -70.2], side: 'right', fallback: [359.9, 278.2] },
];
