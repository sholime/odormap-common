import { describe, expect, it } from 'vitest';
import { LANGUAGES, ODOR_KINDS, ODOR_STRENGTHS, SOURCE_KINDS } from './enums.js';
import { LABELS } from './labels.js';

// TypeScript already checks that every value has a label.
// These tests also make sure no label was left empty.
describe('LABELS', () => {
  for (const language of LANGUAGES) {
    it(`has a non-empty label for every value in ${language}`, () => {
      const labels = LABELS[language];
      for (const kind of ODOR_KINDS) expect(labels.odorKind[kind]).not.toBe('');
      for (const strength of ODOR_STRENGTHS) expect(labels.odorStrength[strength]).not.toBe('');
      for (const kind of SOURCE_KINDS) expect(labels.sourceKind[kind]).not.toBe('');
    });
  }
});
