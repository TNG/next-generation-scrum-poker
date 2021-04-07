import { CardValue } from './types/WebSocket';

export const SCALES: { [id: string]: { name: string; values: Array<CardValue> } } = {
  FIBONACCI_SCALE: {
    name: 'Fibonacci',
    values: ['coffee', '?', '0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '∞'],
  },
  COHEN_SCALE: {
    name: 'Cohen',
    values: ['coffee', '?', '0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '∞'],
  },
  FIXED_RATIO_SCALE: {
    name: 'Fixed Ratio',
    values: ['coffee', '?', '1', '2', '4', '8', '16', '32', '64', '128', '∞'],
  },
  SIZES_SCALE: { name: 'Sizes', values: ['coffee', '?', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '∞'] },
};
