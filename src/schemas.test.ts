import { describe, expect, it } from 'vitest';
import { CreateReportRequest, RegisterRequest, ReportsQuery, UpdateReportRequest } from './schemas.js';

const validReport = {
  location: { lat: 45.8155, lon: 19.6318 },
  strength: 4,
  smellKind: 'pig_manure',
};

describe('CreateReportRequest', () => {
  it('accepts a minimal report and sets duration to not_set', () => {
    const report = CreateReportRequest.parse(validReport);
    expect(report.duration).toBe('not_set');
  });

  it('rejects a strength outside 1 to 5', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, strength: 6 }).success).toBe(false);
  });

  it('rejects an unknown smell kind', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, smellKind: 'roses' }).success).toBe(false);
  });

  it('requires a description when the smell kind is other', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, smellKind: 'other' }).success).toBe(false);
    expect(
      CreateReportRequest.safeParse({ ...validReport, smellKind: 'other', smellKindOther: 'Burnt plastic' }).success,
    ).toBe(true);
  });

  it('rejects a comment longer than 500 characters', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, comment: 'x'.repeat(501) }).success).toBe(false);
  });
});

describe('UpdateReportRequest', () => {
  it('needs at least one field', () => {
    expect(UpdateReportRequest.safeParse({}).success).toBe(false);
    expect(UpdateReportRequest.safeParse({ duration: '1_to_3_hours' }).success).toBe(true);
  });
});

describe('RegisterRequest', () => {
  it('requires accepting the privacy notice', () => {
    const base = { email: 'ana@example.com', password: 'long-enough', displayName: 'Ana', language: 'sr' };
    expect(RegisterRequest.safeParse({ ...base, acceptPrivacy: false }).success).toBe(false);
    expect(RegisterRequest.safeParse({ ...base, acceptPrivacy: true }).success).toBe(true);
  });
});

describe('ReportsQuery', () => {
  it('turns map box query parameters into numbers', () => {
    const query = ReportsQuery.parse({
      areaId: 'backa-topola',
      from: '2026-11-01T00:00:00Z',
      to: '2026-11-17T00:00:00Z',
      minLat: '45.7',
    });
    expect(query.minLat).toBe(45.7);
  });
});
