// Fixed lists of values used across OdorMap.
// Each list is the single source of truth: the TypeScript types,
// the validation schemas and the translations are all built from it.
// To add a value, add it here and give it a label in labels.ts.

/**
 * What the odor is like. 'not_set' means the person did not say,
 * which is common: people often notice an odor without knowing its cause.
 */
export const ODOR_KINDS = [
  'not_set',
  'garbage',
  'rotten_meat',
  'pig_manure',
  'poultry',
  'cattle_manure',
  'field_spreading',
  'smoke',
  'chemical',
  'sewage',
  'other',
] as const;
export type OdorKind = (typeof ODOR_KINDS)[number];

/** How strong the odor is, from 1 (barely noticeable) to 5 (unbearable). */
export const ODOR_STRENGTHS = [1, 2, 3, 4, 5] as const;
export type OdorStrength = (typeof ODOR_STRENGTHS)[number];

/**
 * How long the odor lasted. Starts as 'not_set' and can be filled in later.
 * 'not_set' is shown to people as "N/A".
 */
export const DURATIONS = [
  'not_set',
  'under_15_min',
  '15_to_60_min',
  '1_to_3_hours',
  'over_3_hours',
] as const;
export type Duration = (typeof DURATIONS)[number];

/** What kind of place a known pollution source is. */
export const SOURCE_KINDS = [
  'landfill',
  'rendering_plant',
  'pig_farm',
  'poultry_farm',
  'cattle_farm',
  'wastewater',
  'industrial',
  'other',
] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

/** UI languages. 'sr' is Serbian in Latin script. */
export const LANGUAGES = ['sr', 'hu'] as const;
export type Language = (typeof LANGUAGES)[number];

/** What a user is allowed to do. Admins manage pollution sources. */
export const ROLES = ['user', 'admin'] as const;
export type Role = (typeof ROLES)[number];
