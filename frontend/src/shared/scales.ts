import { CardValue, VOTE_COFFEE } from './cards';

export type ScaleName = 'FIBONACCI_SCALE' | 'COHEN_SCALE' | 'FIXED_RATIO_SCALE' | 'SIZES_SCALE';

export const SCALES: { [id in ScaleName]: { name: string; values: Array<CardValue> } } = {
  FIBONACCI_SCALE: {
    name: 'Fibonacci',
    values: [VOTE_COFFEE, '?', '0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '∞'],
  },
  COHEN_SCALE: {
    name: 'Cohen',
    values: [VOTE_COFFEE, '?', '0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '∞'],
  },
  FIXED_RATIO_SCALE: {
    name: 'Fixed Ratio',
    values: [VOTE_COFFEE, '?', '1', '2', '4', '8', '16', '32', '64', '128', '∞'],
  },
  SIZES_SCALE: { name: 'Sizes', values: [VOTE_COFFEE, '?', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '∞'] },
};
