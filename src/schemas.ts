// Shapes of the data sent between the apps and the API.
//
// Each schema does two jobs:
//   1. At runtime it validates data, e.g. `CreateReportRequest.parse(body)`.
//   2. At compile time it gives a TypeScript type, e.g. `CreateReportRequest`.
//
// Field names are camelCase because this is JSON sent over the API.
// Times are ISO 8601 strings in UTC, e.g. "2026-11-17T18:30:00Z".

import { z } from 'zod';
import {
  LANGUAGES,
  ROLES,
  ODOR_KINDS,
  ODOR_STRENGTHS,
  SOURCE_KINDS,
} from './enums.js';

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

export const Latitude = z.number().min(-90).max(90);
export const Longitude = z.number().min(-180).max(180);

export const Point = z.object({
  lat: Latitude,
  lon: Longitude,
});
export type Point = z.infer<typeof Point>;

/** A closed outline on the map, e.g. a town boundary or a large farm. */
export const Polygon = z.array(Point).min(3);
export type Polygon = z.infer<typeof Polygon>;

const Timestamp = z.iso.datetime();

// Schemas for the fixed lists in enums.ts. They end in "Schema" because
// enums.ts already uses the plain names for the TypeScript types.
export const OdorKindSchema = z.enum(ODOR_KINDS);
export const OdorStrengthSchema = z.union(ODOR_STRENGTHS.map((n) => z.literal(n)));
export const SourceKindSchema = z.enum(SOURCE_KINDS);
export const LanguageSchema = z.enum(LANGUAGES);
export const RoleSchema = z.enum(ROLES);

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------

export const RegisterRequest = z.object({
  email: z.email(),
  password: z.string().min(8).max(200),
  displayName: z.string().trim().min(1).max(50),
  language: LanguageSchema,
  /** The person must accept the privacy notice to create an account. */
  acceptPrivacy: z.literal(true),
});
export type RegisterRequest = z.infer<typeof RegisterRequest>;

export const LoginRequest = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequest>;

export const GoogleLoginRequest = z.object({
  /** The ID token returned by Google Sign-In in the browser or phone app. */
  idToken: z.string().min(1),
  /** Only used the first time, when the account is created. */
  language: LanguageSchema.optional(),
  /** Required the first time, when the account is created. */
  acceptPrivacy: z.boolean().optional(),
});
export type GoogleLoginRequest = z.infer<typeof GoogleLoginRequest>;

/**
 * Use the app without an account. The server creates a guest account with no email
 * or password; the app keeps its tokens on the phone. A guest can later register or
 * sign in with Google to keep their reports in a full account.
 */
export const GuestLoginRequest = z.object({
  language: LanguageSchema,
  /** The person must accept the privacy notice, as for any account. */
  acceptPrivacy: z.literal(true),
});
export type GuestLoginRequest = z.infer<typeof GuestLoginRequest>;

export const RefreshRequest = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshRequest = z.infer<typeof RefreshRequest>;

export const AuthTokens = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof AuthTokens>;

/** The logged-in user's own profile. */
export const User = z.object({
  id: z.uuid(),
  /** Missing for guests. */
  email: z.email().optional(),
  /** True for an account made with "continue without account". */
  isGuest: z.boolean(),
  displayName: z.string(),
  language: LanguageSchema,
  role: RoleSchema,
  createdAt: Timestamp,
});
export type User = z.infer<typeof User>;

export const UpdateMeRequest = z.object({
  displayName: z.string().trim().min(1).max(50).optional(),
  language: LanguageSchema.optional(),
});
export type UpdateMeRequest = z.infer<typeof UpdateMeRequest>;

/** How someone signs in: with an email and password, with Google, or both. Empty for guests. */
export const SignInMethodSchema = z.enum(['password', 'google']);
export type SignInMethod = z.infer<typeof SignInMethodSchema>;

/** A user as admins see them on the "Users" screen. */
export const AdminUser = User.extend({
  signInMethods: z.array(SignInMethodSchema),
  /** A blocked user can still log in, but cannot send reports. */
  blocked: z.boolean(),
  reportCount: z.number().int().min(0),
  /** Missing when the user has sent no reports. */
  lastReportAt: Timestamp.optional(),
});
export type AdminUser = z.infer<typeof AdminUser>;

/** What an admin can change about another user. */
export const UpdateUserRequest = z.object({
  role: RoleSchema.optional(),
  blocked: z.boolean().optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;

// ---------------------------------------------------------------------------
// Areas (towns or regions the app covers)
// ---------------------------------------------------------------------------

export const Area = z.object({
  /** Short readable id, e.g. "backa-topola". */
  areaId: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  boundary: Polygon,
  /** The first language is the area's default. */
  languages: z.array(LanguageSchema).min(1),
  /** e.g. "Europe/Belgrade" */
  timezone: z.string(),
  active: z.boolean(),
});
export type Area = z.infer<typeof Area>;

// ---------------------------------------------------------------------------
// Pollution sources (known places that may cause odors)
// ---------------------------------------------------------------------------

export const CreateSourceRequest = z.object({
  areaId: z.string(),
  name: z.string().trim().min(1).max(100),
  kind: SourceKindSchema,
  location: Point,
  outline: Polygon.optional(),
  description: z.string().max(1000).optional(),
});
export type CreateSourceRequest = z.infer<typeof CreateSourceRequest>;

export const UpdateSourceRequest = CreateSourceRequest.partial().extend({
  active: z.boolean().optional(),
});
export type UpdateSourceRequest = z.infer<typeof UpdateSourceRequest>;

export const PollutionSource = CreateSourceRequest.extend({
  id: z.uuid(),
  active: z.boolean(),
  createdAt: Timestamp,
});
export type PollutionSource = z.infer<typeof PollutionSource>;

// ---------------------------------------------------------------------------
// Odor reports
// ---------------------------------------------------------------------------

/** Weather at the report's place when it was sent. Filled in by the server. */
export const Weather = z.object({
  /** Wind speed at 10 m, in metres per second. */
  windSpeedMs: z.number(),
  /** Direction the wind blows FROM, in degrees. 0 = north, 90 = east. */
  windDirectionDeg: z.number(),
  /** Air temperature at 2 m, in degrees Celsius. */
  temperatureC: z.number(),
  /** Relative humidity at 2 m, in percent. */
  humidityPercent: z.number(),
  /** Air pressure at sea level, in hectopascals. */
  pressureHpa: z.number(),
});
export type Weather = z.infer<typeof Weather>;

/**
 * What the app sends when someone reports an odor.
 * Reports are for odors present right now: the server sets the time.
 */
export const CreateReportRequest = z
  .object({
    location: Point,
    /** GPS accuracy in metres, as reported by the phone. */
    locationAccuracyM: z.number().min(0).optional(),
    strength: OdorStrengthSchema,
    odorKind: OdorKindSchema.default('not_set'),
    /** Free text, only when odorKind is 'other'. */
    odorKindOther: z.string().trim().min(1).max(100).optional(),
    comment: z.string().trim().max(500).optional(),
    suspectedSourceId: z.uuid().optional(),
  })
  .refine((r) => r.odorKind !== 'other' || r.odorKindOther !== undefined, {
    message: 'Describe the odor when choosing "other"',
    path: ['odorKindOther'],
  });
export type CreateReportRequest = z.infer<typeof CreateReportRequest>;

/** What the reporter can change after sending a report. Send only the fields that change. */
export const UpdateReportRequest = z
  .object({
    strength: OdorStrengthSchema.optional(),
    odorKind: OdorKindSchema.optional(),
    odorKindOther: z.string().trim().min(1).max(100).optional(),
    comment: z.string().trim().max(500).optional(),
  })
  .refine((r) => Object.values(r).some((value) => value !== undefined), {
    message: 'Nothing to update',
  })
  .refine((r) => r.odorKind !== 'other' || r.odorKindOther !== undefined, {
    message: 'Describe the odor when choosing "other"',
    path: ['odorKindOther'],
  });
export type UpdateReportRequest = z.infer<typeof UpdateReportRequest>;

/** A report as its owner sees it. */
export const OdorReport = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  areaId: z.string(),
  createdAt: Timestamp,
  observedAt: Timestamp,
  location: Point,
  locationAccuracyM: z.number().optional(),
  strength: OdorStrengthSchema,
  odorKind: OdorKindSchema,
  odorKindOther: z.string().optional(),
  comment: z.string().optional(),
  suspectedSourceId: z.uuid().optional(),
  /** Missing while the weather service could not be reached. */
  weather: Weather.optional(),
});
export type OdorReport = z.infer<typeof OdorReport>;

/**
 * A report as everyone sees it: anonymous.
 * No user id, and the location is rounded to about 100 m. The comment is public.
 * isMine tells the person asking which reports are their own, without showing who wrote the others.
 */
export const PublicReport = OdorReport.pick({
  id: true,
  areaId: true,
  observedAt: true,
  location: true,
  strength: true,
  odorKind: true,
  odorKindOther: true,
  comment: true,
  weather: true,
}).extend({ isMine: z.boolean() });
export type PublicReport = z.infer<typeof PublicReport>;

/** Filters for listing reports, sent as URL query parameters. */
export const ReportsQuery = z.object({
  areaId: z.string(),
  from: Timestamp,
  to: Timestamp,
  // Optional map box. Query parameters arrive as text, so they are converted to numbers.
  minLat: z.coerce.number().pipe(Latitude).optional(),
  maxLat: z.coerce.number().pipe(Latitude).optional(),
  minLon: z.coerce.number().pipe(Longitude).optional(),
  maxLon: z.coerce.number().pipe(Longitude).optional(),
});
export type ReportsQuery = z.infer<typeof ReportsQuery>;
