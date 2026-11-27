import { describe, expect, it } from 'vitest';
import {
  AdminUser,
  UpdateUserRequest,
  CreateReportRequest,
  GuestLoginRequest,
  PublicReport,
  RegisterRequest,
  ReportsQuery,
  UpdateReportRequest,
} from './schemas.js';

const validReport = {
  location: { lat: 45.8155, lon: 19.6318 },
  strength: 4,
  odorKind: 'pig_manure',
};

describe('CreateReportRequest', () => {
  it('accepts a minimal report', () => {
    expect(CreateReportRequest.safeParse(validReport).success).toBe(true);
  });

  it('rejects a strength outside 1 to 5', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, strength: 6 }).success).toBe(false);
  });

  it('sets the odor kind to not_set when it is missing', () => {
    const { odorKind, ...withoutKind } = validReport;
    expect(CreateReportRequest.parse(withoutKind).odorKind).toBe('not_set');
  });

  it('requires a strength', () => {
    const { strength, ...withoutStrength } = validReport;
    expect(CreateReportRequest.safeParse(withoutStrength).success).toBe(false);
  });

  it('rejects an unknown odor kind', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, odorKind: 'roses' }).success).toBe(false);
  });

  it('requires a description when the odor kind is other', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, odorKind: 'other' }).success).toBe(false);
    expect(
      CreateReportRequest.safeParse({ ...validReport, odorKind: 'other', odorKindOther: 'Burnt plastic' }).success,
    ).toBe(true);
  });

  it('rejects a comment longer than 500 characters', () => {
    expect(CreateReportRequest.safeParse({ ...validReport, comment: 'x'.repeat(501) }).success).toBe(false);
  });
});

describe('UpdateReportRequest', () => {
  it('needs at least one field', () => {
    expect(UpdateReportRequest.safeParse({}).success).toBe(false);
    expect(UpdateReportRequest.safeParse({ comment: 'Still there' }).success).toBe(true);
  });

  it('can change strength and odor kind', () => {
    expect(UpdateReportRequest.safeParse({ strength: 2, odorKind: 'smoke' }).success).toBe(true);
    expect(UpdateReportRequest.safeParse({ strength: 9 }).success).toBe(false);
  });

  it('requires a description when changing the odor kind to other', () => {
    expect(UpdateReportRequest.safeParse({ odorKind: 'other' }).success).toBe(false);
  });
});

describe('RegisterRequest', () => {
  it('requires accepting the privacy notice', () => {
    const base = { email: 'ana@example.com', password: 'long-enough', displayName: 'Ana', language: 'sr' };
    expect(RegisterRequest.safeParse({ ...base, acceptPrivacy: false }).success).toBe(false);
    expect(RegisterRequest.safeParse({ ...base, acceptPrivacy: true }).success).toBe(true);
  });
});

describe('GuestLoginRequest', () => {
  it('requires a language and accepting the privacy notice', () => {
    expect(GuestLoginRequest.safeParse({ language: 'hu', acceptPrivacy: true }).success).toBe(true);
    expect(GuestLoginRequest.safeParse({ language: 'hu' }).success).toBe(false);
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

describe('PublicReport', () => {
  it('has the comment and isMine, but no user id', () => {
    const report = PublicReport.parse({
      id: '019a9a3c-6b1e-7000-8000-0000000000bb',
      userId: '019a9a3c-6b1e-7000-8000-0000000000aa',
      areaId: 'backa-topola',
      observedAt: '2026-11-24T19:14:00Z',
      location: { lat: 45.816, lon: 19.632 },
      strength: 4,
      odorKind: 'rotten_meat',
      comment: 'Kod škole',
      isMine: true,
    });
    expect(report).toMatchObject({ comment: 'Kod škole', isMine: true });
    expect(report).not.toHaveProperty('userId');
  });

  it('can carry the author, for admins', () => {
    const author = { id: '019a9a3c-6b1e-7000-8000-0000000000aa', displayName: 'Ana', email: 'ana@example.com' };
    const report = PublicReport.parse({
      id: '019a9a3c-6b1e-7000-8000-0000000000bb',
      areaId: 'backa-topola',
      observedAt: '2026-11-24T19:14:00Z',
      location: { lat: 45.816, lon: 19.632 },
      strength: 4,
      odorKind: 'rotten_meat',
      isMine: false,
      author,
    });
    expect(report.author).toEqual(author);
  });
});

describe('AdminUser', () => {
  const user = {
    id: '019a9a3c-6b1e-7000-8000-000000000001',
    isGuest: true,
    displayName: 'Gost',
    language: 'sr',
    role: 'user',
    createdAt: '2026-11-25T10:00:00Z',
    signInMethods: [],
    blocked: false,
    reportCount: 0,
  };

  it('accepts a guest with no reports', () => {
    expect(AdminUser.safeParse(user).success).toBe(true);
  });

  it('rejects an unknown sign-in method', () => {
    expect(AdminUser.safeParse({ ...user, signInMethods: ['facebook'] }).success).toBe(false);
  });
});

describe('UpdateUserRequest', () => {
  it('accepts a role or blocked', () => {
    expect(UpdateUserRequest.safeParse({ role: 'admin' }).success).toBe(true);
    expect(UpdateUserRequest.safeParse({ blocked: true }).success).toBe(true);
  });

  it('rejects an unknown role', () => {
    expect(UpdateUserRequest.safeParse({ role: 'owner' }).success).toBe(false);
  });
});
