// Special card values
export const VOTE_COFFEE = 'coffee';
export const VOTE_OBSERVER = 'observer';
export const VOTE_NOTE_VOTED = 'not-voted';

export const SIZES_ORDERED = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const isSize = (card: CardValue): card is typeof SIZES_ORDERED[number] =>
  SIZES_ORDERED.some((value) => value === card);

export type CardValue =
  | typeof VOTE_OBSERVER
  | typeof VOTE_NOTE_VOTED
  | typeof VOTE_COFFEE
  | '?'
  | '∞'
  | typeof SIZES_ORDERED[number]
  | '0'
  | '0.5'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '8'
  | '13'
  | '16'
  | '20'
  | '21'
  | '32'
  | '34'
  | '40'
  | '55'
  | '64'
  | '89'
  | '100'
  | '128';
