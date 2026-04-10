import { CardValue, PREDEFINED_SCALE_VALUES, SPECIAL_VALUES_ORDERED } from './cards';

// Maximum number of custom card values allowed
export const MAX_CUSTOM_CARDS = 12;

// Upper bound for a complete scale: the custom card limit plus the special cards that can be
// appended. This also covers every predefined scale (the longest, Cohen, has 14 entries).
export const MAX_SCALE_LENGTH = MAX_CUSTOM_CARDS + SPECIAL_VALUES_ORDERED.length;

// Maximum length for a single card value
export const MAX_CARD_VALUE_LENGTH = 4;

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
 * Validates a complete scale as received from a client. Accepts both predefined scales (which may
 * contain non-alphanumeric tokens such as `0.5`, `∞`, `?` and `coffee`) and custom scales
 * (alphanumeric user values plus appended special cards). Guards the untrusted WebSocket boundary,
 * so the input is typed as `unknown`.
 * @param scale - The scale to validate
 * @returns true if the scale is a valid, non-empty, duplicate-free array of allowed tokens
 */
export function isValidScale(scale: unknown): scale is CardValue[] {
  if (!Array.isArray(scale) || scale.length < 1 || scale.length > MAX_SCALE_LENGTH) {
    return false;
  }

  const seen = new Set<unknown>();
  for (const value of scale) {
    if (typeof value !== 'string' || seen.has(value)) {
      return false;
    }
    seen.add(value);
    if (!isValidCustomCardValue(value) && !PREDEFINED_SCALE_VALUES.has(value)) {
      return false;
    }
  }

  return true;
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
