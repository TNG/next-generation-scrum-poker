// Special card values
export const VOTE_COFFEE = 'coffee';
export const VOTE_OBSERVER = 'observer';
export const VOTE_NOTE_VOTED = 'not-voted';

export const SPECIAL_VALUES_ORDERED = ['∞', '?', VOTE_COFFEE] as const;

const ABSTAINING_VOTES_ORDERED = [VOTE_NOTE_VOTED, VOTE_OBSERVER] as const;

export const SIZES_ORDERED = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

const NUMERIC_VALUES_ORDERED = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '4',
  '5',
  '8',
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
] as const;

export type CardValue = (typeof ALL_VALUES_ORDERED)[number];

export const CARDS_ORDERED_BY_VALUE = new Map(
  ALL_VALUES_ORDERED.map((value, index) => [value, index]),
);
