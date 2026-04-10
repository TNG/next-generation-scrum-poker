import { describe, expect, it } from 'vitest';
import {
  buildCustomScale,
  getAddCardError,
  isValidCustomCardValue,
  isValidScale,
  MAX_CUSTOM_CARDS,
  MAX_SCALE_LENGTH,
  normalizeCardValue,
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

  describe('isValidScale', () => {
    it('should accept every predefined scale', () => {
      for (const { values } of Object.values(SCALES)) {
        expect(isValidScale(values)).toBe(true);
      }
    });

    it('should accept a custom scale of user values plus appended special cards', () => {
      expect(isValidScale(['LOW', 'MED', 'HI', '∞', '?', 'coffee'])).toBe(true);
    });

    it('should accept a single card', () => {
      expect(isValidScale(['1'])).toBe(true);
    });

    it('should accept the maximum allowed length', () => {
      const scale = Array.from({ length: MAX_SCALE_LENGTH }, (_, i) => `C${i}`);
      expect(isValidScale(scale)).toBe(true);
    });

    it('should reject an empty scale', () => {
      expect(isValidScale([])).toBe(false);
    });

    it('should reject a scale exceeding the maximum length', () => {
      const scale = Array.from({ length: MAX_SCALE_LENGTH + 1 }, (_, i) => `C${i}`);
      expect(isValidScale(scale)).toBe(false);
    });

    it('should reject duplicate values', () => {
      expect(isValidScale(['XS', 'S', 'XS', 'M'])).toBe(false);
    });

    it('should reject tokens that are neither valid custom nor predefined values', () => {
      expect(isValidScale(['XS', 'TOOLONG', 'M'])).toBe(false);
      expect(isValidScale(['AB CD'])).toBe(false);
      expect(isValidScale(['observer'])).toBe(false);
    });

    it('should reject non-array and non-string input', () => {
      expect(isValidScale('XS')).toBe(false);
      expect(isValidScale(null)).toBe(false);
      expect(isValidScale(['XS', 5])).toBe(false);
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
});
