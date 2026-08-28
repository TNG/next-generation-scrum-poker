import { describe, expect, it } from 'vitest';
import {
  buildCustomScale,
  getAddCardError,
  isValidCustomCardValue,
  isValidScale,
  MAX_CUSTOM_CARDS,
  MAX_SCALE_SIZE,
  normalizeCardValue,
  validateCustomScale,
} from '../../../shared/customScale';
import { SCALES } from '../../../shared/scales';

describe('customScale', () => {
  describe('isValidCustomCardValue', () => {
    it('should accept valid uppercase alphanumeric values', () => {
      expect(isValidCustomCardValue('A')).toBe(true);
      expect(isValidCustomCardValue('XS')).toBe(true);
      expect(isValidCustomCardValue('ABC')).toBe(true);
      expect(isValidCustomCardValue('ABCD')).toBe(true);
      expect(isValidCustomCardValue('1')).toBe(true);
      expect(isValidCustomCardValue('123')).toBe(true);
      expect(isValidCustomCardValue('A1B2')).toBe(true);
    });

    it('should reject values longer than 4 characters', () => {
      expect(isValidCustomCardValue('ABCDE')).toBe(false);
      expect(isValidCustomCardValue('12345')).toBe(false);
    });

    it('should reject empty values', () => {
      expect(isValidCustomCardValue('')).toBe(false);
    });

    it('should reject lowercase values', () => {
      expect(isValidCustomCardValue('abc')).toBe(false);
      expect(isValidCustomCardValue('Abc')).toBe(false);
    });

    it('should reject special characters', () => {
      expect(isValidCustomCardValue('A-B')).toBe(false);
      expect(isValidCustomCardValue('A.B')).toBe(false);
      expect(isValidCustomCardValue('A_B')).toBe(false);
      expect(isValidCustomCardValue('A B')).toBe(false);
      expect(isValidCustomCardValue('A!')).toBe(false);
    });

    it('should reject decimal numbers', () => {
      expect(isValidCustomCardValue('0.5')).toBe(false);
      expect(isValidCustomCardValue('1.5')).toBe(false);
    });
  });

  describe('normalizeCardValue', () => {
    it('should convert lowercase to uppercase', () => {
      expect(normalizeCardValue('abc')).toBe('ABC');
      expect(normalizeCardValue('xs')).toBe('XS');
      expect(normalizeCardValue('a1b2')).toBe('A1B2');
    });

    it('should truncate values longer than max length', () => {
      expect(normalizeCardValue('ABCDE')).toBe('ABCD');
      expect(normalizeCardValue('12345')).toBe('1234');
      expect(normalizeCardValue('ABCDEFGH')).toBe('ABCD');
    });

    it('should handle mixed case and length', () => {
      expect(normalizeCardValue('abcde')).toBe('ABCD');
      expect(normalizeCardValue('XyZ123')).toBe('XYZ1');
    });

    it('should preserve valid values', () => {
      expect(normalizeCardValue('XS')).toBe('XS');
      expect(normalizeCardValue('123')).toBe('123');
      expect(normalizeCardValue('ABCD')).toBe('ABCD');
    });

    it('should handle empty string', () => {
      expect(normalizeCardValue('')).toBe('');
    });
  });

  describe('validateCustomScale', () => {
    it('should accept valid scales', () => {
      const result = validateCustomScale(['XS', 'S', 'M', 'L', 'XL']);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept single card', () => {
      const result = validateCustomScale(['1']);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept maximum number of cards', () => {
      const cards = Array.from({ length: MAX_CUSTOM_CARDS }, (_, i) => `C${i}`);
      const result = validateCustomScale(cards);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty scale', () => {
      const result = validateCustomScale([]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one card value is required');
    });

    it('should reject scale exceeding maximum cards', () => {
      const cards = Array.from({ length: MAX_CUSTOM_CARDS + 1 }, (_, i) => `C${i}`);
      const result = validateCustomScale(cards);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(`Maximum ${MAX_CUSTOM_CARDS} cards allowed`);
    });

    it('should reject duplicate values', () => {
      const result = validateCustomScale(['XS', 'S', 'XS', 'M']);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Duplicate card value: XS');
    });

    it('should reject invalid card values', () => {
      const result = validateCustomScale(['XS', 'ABCDE', 'M']);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid card value'))).toBe(true);
    });

    it('should report multiple errors', () => {
      const result = validateCustomScale(['XS', 'XS', 'ABCDE']);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('getAddCardError', () => {
    it('should return null for valid card', () => {
      expect(getAddCardError('XS', ['S', 'M'])).toBeNull();
      expect(getAddCardError('123', [])).toBeNull();
    });

    it('should return null for empty value', () => {
      expect(getAddCardError('', ['S', 'M'])).toBeNull();
    });

    it('should return error for invalid characters', () => {
      const error = getAddCardError('A-B', []);
      expect(error).toBe('Only alphanumeric characters allowed (A-Z, 0-9)');
    });

    it('should return error for lowercase', () => {
      const error = getAddCardError('abc', []);
      expect(error).toBe('Only alphanumeric characters allowed (A-Z, 0-9)');
    });

    it('should return error for duplicate value', () => {
      const error = getAddCardError('XS', ['XS', 'S', 'M']);
      expect(error).toBe('This value already exists');
    });

    it('should return error when at maximum cards', () => {
      const existingCards = Array.from({ length: MAX_CUSTOM_CARDS }, (_, i) => `C${i}`);
      const error = getAddCardError('NEW', existingCards);
      expect(error).toBe(`Maximum ${MAX_CUSTOM_CARDS} cards allowed`);
    });

    it('should prioritize validation over duplicate check', () => {
      const error = getAddCardError('abc', ['ABC']);
      expect(error).toBe('Only alphanumeric characters allowed (A-Z, 0-9)');
    });
  });

  describe('buildCustomScale', () => {
    it('should build scale with only card values', () => {
      const scale = buildCustomScale(['XS', 'S', 'M'], {
        infinite: false,
        question: false,
        coffee: false,
      });
      expect(scale).toEqual(['XS', 'S', 'M']);
    });

    it('should append special cards in correct order', () => {
      const scale = buildCustomScale(['1', '2'], {
        infinite: true,
        question: true,
        coffee: true,
      });
      expect(scale).toEqual(['1', '2', '∞', '?', 'coffee']);
    });

    it('should append only selected special cards', () => {
      const scale = buildCustomScale(['1', '2'], {
        infinite: true,
        question: false,
        coffee: true,
      });
      expect(scale).toEqual(['1', '2', '∞', 'coffee']);
    });

    it('should handle empty card values with special cards', () => {
      const scale = buildCustomScale([], {
        infinite: true,
        question: true,
        coffee: false,
      });
      expect(scale).toEqual(['∞', '?']);
    });

    it('should maintain card value order', () => {
      const scale = buildCustomScale(['C', 'B', 'A'], {
        infinite: false,
        question: false,
        coffee: false,
      });
      expect(scale).toEqual(['C', 'B', 'A']);
    });

    it('should always append special cards at end', () => {
      const scale = buildCustomScale(['1', '2', '3'], {
        infinite: false,
        question: true,
        coffee: false,
      });
      expect(scale).toEqual(['1', '2', '3', '?']);
    });
  });

  describe('isValidScale', () => {
    it('should accept any predefined scale', () => {
      for (const { values } of Object.values(SCALES)) {
        expect(isValidScale(values)).toBe(true);
      }
    });

    it('should accept a custom scale with only alphanumeric values', () => {
      expect(isValidScale(['XS', 'S', 'M', 'L'])).toBe(true);
    });

    it('should accept a custom scale including special cards', () => {
      expect(isValidScale(['1', '2', '∞', '?', 'coffee'])).toBe(true);
      expect(isValidScale(['XS', 'coffee'])).toBe(true);
    });

    it('should accept a single-card custom scale', () => {
      expect(isValidScale(['1'])).toBe(true);
    });

    it('should accept the maximum custom scale size', () => {
      const scale = [
        ...Array.from({ length: MAX_CUSTOM_CARDS }, (_, i) => `C${i}`),
        '∞',
        '?',
        'coffee',
      ];
      expect(isValidScale(scale)).toBe(true);
    });

    it('should reject a non-array', () => {
      expect(isValidScale(null)).toBe(false);
      expect(isValidScale(undefined)).toBe(false);
      expect(isValidScale('XS')).toBe(false);
      expect(isValidScale({})).toBe(false);
    });

    it('should reject an empty array', () => {
      expect(isValidScale([])).toBe(false);
    });

    it('should reject a scale exceeding the maximum size', () => {
      const scale = Array.from({ length: MAX_SCALE_SIZE + 1 }, (_, i) => `C${i}`);
      expect(isValidScale(scale)).toBe(false);
    });

    it('should reject non-string entries', () => {
      expect(isValidScale(['XS', 1, 'M'])).toBe(false);
    });

    it('should reject empty-string entries', () => {
      expect(isValidScale(['XS', '', 'M'])).toBe(false);
    });

    it('should reject duplicates in a custom scale', () => {
      expect(isValidScale(['XS', 'XS', 'M'])).toBe(false);
    });

    it('should reject custom values with invalid characters', () => {
      expect(isValidScale(['XS', 'A-B'])).toBe(false);
    });

    it('should reject custom values exceeding the length limit', () => {
      expect(isValidScale(['ABCDE'])).toBe(false);
    });

    it('should reject unknown special-card strings', () => {
      expect(isValidScale(['XS', 'observer'])).toBe(false);
      expect(isValidScale(['XS', 'not-voted'])).toBe(false);
    });

    it('should reject a scale that is not a predefined scale and not a valid custom scale', () => {
      // 0.5 is valid in a predefined scale but not as a custom value
      expect(isValidScale(['0.5', '1'])).toBe(false);
    });
  });
});
