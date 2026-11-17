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
  DURATIONS,
  LANGUAGES,
  ROLES,
  SMELL_KINDS,
  SMELL_STRENGTHS,
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
export const SmellKindSchema = z.enum(SMELL_KINDS);
export const SmellStrengthSchema = z.union(SMELL_STRENGTHS.map((n) => z.literal(n)));
export const DurationSchema = z.enum(DURATIONS);
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
  email: z.email(),
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
// Pollution sources (known places that may cause smells)
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
// Smell reports
// ---------------------------------------------------------------------------

/** Weather at the report's place and time. Filled in by the server. */
export const Weather = z.object({
  /** Wind speed at 10 m, in metres per second. */
  windSpeedMs: z.number(),
  /** Direction the wind blows FROM, in degrees. 0 = north, 90 = east. */
  windDirectionDeg: z.number(),
  /** Strongest gusts at 10 m, in metres per second. */
  windGustsMs: z.number(),
  /** Air temperature at 2 m, in degrees Celsius. */
  temperatureC: z.number(),
  /** The time of the weather reading that was used. */
  weatherTime: Timestamp,
});
export type Weather = z.infer<typeof Weather>;

/** What the app sends when someone reports a smell. */
export const CreateReportRequest = z
  .object({
    location: Point,
    /** GPS accuracy in metres, as reported by the phone. */
    locationAccuracyM: z.number().min(0).optional(),
    /** When the smell was noticed. The server uses "now" if missing. */
    observedAt: Timestamp.optional(),
    strength: SmellStrengthSchema,
    /** Optional: people often notice a bad smell without knowing what it is. */
    smellKind: SmellKindSchema.optional(),
    /** Free text, only when smellKind is 'other'. */
    smellKindOther: z.string().trim().min(1).max(100).optional(),
    duration: DurationSchema.default('not_set'),
    comment: z.string().trim().max(500).optional(),
    suspectedSourceId: z.uuid().optional(),
  })
  .refine((r) => r.smellKind !== 'other' || r.smellKindOther !== undefined, {
    message: 'Describe the smell when choosing "other"',
    path: ['smellKindOther'],
  });
export type CreateReportRequest = z.infer<typeof CreateReportRequest>;

/** What the reporter can change after sending a report. */
export const UpdateReportRequest = z
  .object({
    duration: DurationSchema.optional(),
    comment: z.string().trim().max(500).optional(),
  })
  .refine((r) => r.duration !== undefined || r.comment !== undefined, {
    message: 'Nothing to update',
  });
export type UpdateReportRequest = z.infer<typeof UpdateReportRequest>;

/** A report as its owner sees it. */
export const SmellReport = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  areaId: z.string(),
  createdAt: Timestamp,
  observedAt: Timestamp,
  location: Point,
  locationAccuracyM: z.number().optional(),
  strength: SmellStrengthSchema,
  smellKind: SmellKindSchema.optional(),
  smellKindOther: z.string().optional(),
  duration: DurationSchema,
  comment: z.string().optional(),
  suspectedSourceId: z.uuid().optional(),
  /** Missing while the weather service could not be reached. */
  weather: Weather.optional(),
});
export type SmellReport = z.infer<typeof SmellReport>;

/**
 * A report as everyone else sees it: anonymous.
 * No user id or comment, and the location is rounded to about 100 m.
 */
export const PublicReport = SmellReport.pick({
  id: true,
  areaId: true,
  observedAt: true,
  location: true,
  strength: true,
  smellKind: true,
  smellKindOther: true,
  duration: true,
  weather: true,
});
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
