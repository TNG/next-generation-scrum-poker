import { CardValue, SIZES_ORDERED, SPECIAL_VALUES_ORDERED } from './cards';

export type ScaleName =
  | 'FIBONACCI_SCALE'
  | 'COHEN_SCALE'
  | 'FIXED_RATIO_SCALE'
  | 'LINEAR_SCALE'
  | 'SIZES_SCALE';

export const SCALES: { [id in ScaleName]: { name: string; values: CardValue[] } } = {
  FIBONACCI_SCALE: {
    name: 'Fibonacci',
    values: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', ...SPECIAL_VALUES_ORDERED],
  },
  COHEN_SCALE: {
    name: 'Cohen',
    values: [
      '0',
      '0.5',
      '1',
      '2',
      '3',
      '5',
      '8',
      '13',
      '20',
      '40',
      '100',
      ...SPECIAL_VALUES_ORDERED,
    ],
  },
  FIXED_RATIO_SCALE: {
    name: 'Fixed Ratio',
    values: ['1', '2', '4', '8', '16', '32', '64', '128', ...SPECIAL_VALUES_ORDERED],
  },
  LINEAR_SCALE: {
    name: 'Linear',
    values: ['0', '1', '2', '3', '4', '5', ...SPECIAL_VALUES_ORDERED],
  },
  SIZES_SCALE: { name: 'Sizes', values: [...SIZES_ORDERED, ...SPECIAL_VALUES_ORDERED] },
};
