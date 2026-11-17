import { describe, expect, it } from 'vitest';
import { DURATIONS, LANGUAGES, SMELL_KINDS, SMELL_STRENGTHS, SOURCE_KINDS } from './enums.js';
import { LABELS } from './labels.js';

// TypeScript already checks that every value has a label.
// These tests also make sure no label was left empty.
describe('LABELS', () => {
  for (const language of LANGUAGES) {
    it(`has a non-empty label for every value in ${language}`, () => {
      const labels = LABELS[language];
      for (const kind of SMELL_KINDS) expect(labels.smellKind[kind]).not.toBe('');
      for (const strength of SMELL_STRENGTHS) expect(labels.smellStrength[strength]).not.toBe('');
      for (const duration of DURATIONS) expect(labels.duration[duration]).not.toBe('');
      for (const kind of SOURCE_KINDS) expect(labels.sourceKind[kind]).not.toBe('');
    });
  }
});
