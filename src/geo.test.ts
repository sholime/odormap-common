import { describe, expect, it } from 'vitest';
import { findAreaFor, isInsidePolygon } from './geo.js';
import type { Area } from './schemas.js';

const square = [
  { lat: 0, lon: 0 },
  { lat: 0, lon: 10 },
  { lat: 10, lon: 10 },
  { lat: 10, lon: 0 },
];

describe('isInsidePolygon', () => {
  it('finds points inside and outside a square', () => {
    expect(isInsidePolygon({ lat: 5, lon: 5 }, square)).toBe(true);
    expect(isInsidePolygon({ lat: 15, lon: 5 }, square)).toBe(false);
  });
});

describe('findAreaFor', () => {
  const area: Area = { areaId: 'test', name: 'Test', boundary: square, languages: ['sr'], timezone: 'UTC', active: true };

  it('finds the area that contains the point', () => {
    expect(findAreaFor({ lat: 5, lon: 5 }, [area])?.areaId).toBe('test');
  });

  it('skips areas that are not active', () => {
    expect(findAreaFor({ lat: 5, lon: 5 }, [{ ...area, active: false }])).toBeUndefined();
  });
});
