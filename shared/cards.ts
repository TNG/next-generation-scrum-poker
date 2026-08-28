// Special card values
export const VOTE_COFFEE = 'coffee';
export const VOTE_OBSERVER = 'observer';
export const VOTE_NOTE_VOTED = 'not-voted';
export const VOTE_HIDDEN = 'hidden';

export const SPECIAL_VALUES_ORDERED = ['∞', '?', VOTE_COFFEE] as const;

const ABSTAINING_VOTES_ORDERED = [VOTE_NOTE_VOTED, VOTE_OBSERVER] as const;

export const SIZES_ORDERED = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

const NUMERIC_VALUES_ORDERED = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '13',
  '16',
  '20',
  '21',
  '32',
  '34',
  '40',
  '55',
  '64',
  '89',
  '100',
  '128',
] as const;

const ALL_VALUES_ORDERED = [
  ...NUMERIC_VALUES_ORDERED,
  ...SIZES_ORDERED,
  ...SPECIAL_VALUES_ORDERED,
  ...ABSTAINING_VOTES_ORDERED,
  VOTE_HIDDEN,
] as const;

// Predefined card values from the ordered list
export type PredefinedCardValue = (typeof ALL_VALUES_ORDERED)[number];

// Allow custom string values for user-defined scales. The `& {}` branding
// preserves autocomplete/type-checking for predefined values while still
// accepting arbitrary strings at runtime (e.g. user-defined scale entries).
export type CustomCardValue = string & {};

// Union type supporting both predefined and custom card values
export type CardValue = PredefinedCardValue | CustomCardValue;

export const CARDS_ORDERED_BY_VALUE = new Map<CardValue, number>(
  ALL_VALUES_ORDERED.map((value, index) => [value, index] as [CardValue, number]),
);
