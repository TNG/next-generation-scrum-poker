// Special card values
export const VOTE_COFFEE = 'coffee';
export const VOTE_OBSERVER = 'observer';
export const VOTE_NOTE_VOTED = 'not-voted';

export const SPECIAL_VALUES_ORDERED = ['∞', '?', VOTE_COFFEE] as const;

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

// Predefined card values: every numeric value, size and special card, plus the abstaining votes
export type PredefinedCardValue =
  | (typeof NUMERIC_VALUES_ORDERED)[number]
  | (typeof SIZES_ORDERED)[number]
  | (typeof SPECIAL_VALUES_ORDERED)[number]
  | typeof VOTE_NOTE_VOTED
  | typeof VOTE_OBSERVER;

// Allow custom string values for user-defined scales while keeping
// autocomplete and literal inference for the predefined values
export type CustomCardValue = string & {};

// Union type supporting both predefined and custom card values
export type CardValue = PredefinedCardValue | CustomCardValue;

// Tokens that may legitimately appear in a scale: numeric values, sizes and special cards.
// The abstaining values (observer, not-voted) are intentionally excluded.
export const PREDEFINED_SCALE_VALUES: ReadonlySet<CardValue> = new Set<CardValue>([
  ...NUMERIC_VALUES_ORDERED,
  ...SIZES_ORDERED,
  ...SPECIAL_VALUES_ORDERED,
]);
