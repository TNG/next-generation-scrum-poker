// Special card values
export const VOTE_COFFEE = 'coffee';
export const VOTE_OBSERVER = 'observer';
export const VOTE_NOTE_VOTED = 'not-voted';

export type CardValue =
  | typeof VOTE_OBSERVER
  | typeof VOTE_NOTE_VOTED
  | typeof VOTE_COFFEE
  | '?'
  | '∞'
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
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
