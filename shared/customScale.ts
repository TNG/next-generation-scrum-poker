import { CardValue, SPECIAL_VALUES_ORDERED } from './cards';
import { SCALES } from './scales';

// Maximum number of custom card values allowed
export const MAX_CUSTOM_CARDS = 25;

// Maximum length for a single card value
export const MAX_CARD_VALUE_LENGTH = 4;

// Absolute upper bound for any accepted scale (custom 25 + 3 special cards)
export const MAX_SCALE_SIZE = MAX_CUSTOM_CARDS + 3;

// Special card values that may be appended to a custom scale
const SPECIAL_CARDS = new Set<string>(SPECIAL_VALUES_ORDERED);

// Regex pattern for valid card values (alphanumeric, 1-4 characters)
export const CARD_VALUE_REGEX = /^[A-Z0-9]{1,4}$/;

/**
 * Validates if a string is a valid custom card value
 * @param value - The value to validate
 * @returns true if valid, false otherwise
 */
export function isValidCustomCardValue(value: string): boolean {
  return CARD_VALUE_REGEX.test(value);
}

/**
 * Normalizes a card value by converting to uppercase and limiting length
 * @param value - The value to normalize
 * @returns Normalized value
 */
export function normalizeCardValue(value: string): string {
  return value.toUpperCase().slice(0, MAX_CARD_VALUE_LENGTH);
}

/**
 * Validates a complete custom scale
 * @param values - Array of card values to validate
 * @returns Validation result with errors if any
 */
export function validateCustomScale(values: string[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (values.length === 0) {
    errors.push('At least one card value is required');
  }

  if (values.length > MAX_CUSTOM_CARDS) {
    errors.push(`Maximum ${MAX_CUSTOM_CARDS} cards allowed`);
  }

  const seen = new Set<string>();
  for (const value of values) {
    if (!isValidCustomCardValue(value)) {
      errors.push(`Invalid card value: ${value}`);
    }
    if (seen.has(value)) {
      errors.push(`Duplicate card value: ${value}`);
    }
    seen.add(value);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Checks if a card value can be added to the current list
 * @param value - The value to check
 * @param existingValues - Current list of card values
 * @returns Error message if invalid, null if valid
 */
export function getAddCardError(value: string, existingValues: string[]): string | null {
  if (!value) {
    return null; // Empty value is not an error, just don't add it
  }

  if (!isValidCustomCardValue(value)) {
    return 'Only alphanumeric characters allowed (A-Z, 0-9)';
  }

  if (existingValues.includes(value)) {
    return 'This value already exists';
  }

  if (existingValues.length >= MAX_CUSTOM_CARDS) {
    return `Maximum ${MAX_CUSTOM_CARDS} cards allowed`;
  }

  return null;
}

/**
 * Builds a complete scale array including special cards
 * @param cardValues - User-defined card values
 * @param specialCards - Object indicating which special cards to include
 * @returns Complete scale array
 */
export function buildCustomScale(
  cardValues: string[],
  specialCards: { infinite: boolean; question: boolean; coffee: boolean },
): CardValue[] {
  const scale: CardValue[] = [...cardValues];

  // Special cards are always appended in this order
  if (specialCards.infinite) scale.push('∞');
  if (specialCards.question) scale.push('?');
  if (specialCards.coffee) scale.push('coffee');

  return scale;
}

/**
 * Server-side validation for an incoming scale payload.
 *
 * Accepts either a known predefined scale (matched by its exact value set)
 * or a custom scale that passes {@link validateCustomScale}. This guards the
 * backend against arbitrary/malicious payloads while still permitting the
 * existing predefined scales, whose values (e.g. `0.5`, `coffee`,
 * `observer`) are not valid *custom* card values.
 *
 * @param scale - The scale array received from the client
 * @returns true if the scale is safe to persist
 */
export function isValidScale(scale: unknown): scale is CardValue[] {
  if (!Array.isArray(scale) || scale.length === 0 || scale.length > MAX_SCALE_SIZE) {
    return false;
  }
  if (scale.some((value) => typeof value !== 'string' || value.length === 0)) {
    return false;
  }
  // Accept any predefined scale by value-set equality
  const scaleKey = (scale as string[]).slice().sort().join('|');
  const matchedPredefined = Object.values(SCALES).some(({ values }) => {
    const predefinedKey = (values as string[]).slice().sort().join('|');
    return predefinedKey === scaleKey;
  });
  if (matchedPredefined) return true;
  // Otherwise it must be a valid custom scale: each entry is either a valid
  // custom card value (alphanumeric, 1-4 chars) or one of the special cards
  // (∞, ?, coffee), with no duplicates.
  const seen = new Set<string>();
  for (const value of scale as string[]) {
    if (!isValidCustomCardValue(value) && !SPECIAL_CARDS.has(value)) return false;
    if (seen.has(value)) return false;
    seen.add(value);
  }
  return true;
}
