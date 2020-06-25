import { CardValue } from './types/WebSocket';

export const COHEN_SCALE: Array<CardValue> = [
  'coffee',
  '?',
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
  '∞',
];

export const FIBONACCI_SCALE: Array<CardValue> = [
  'coffee',
  '?',
  '0',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '21',
  '34',
  '55',
  '89',
  '∞',
];

export const FIXED_RATIO_SCALE: Array<CardValue> = [
  'coffee',
  '?',
  '1',
  '2',
  '4',
  '8',
  '16',
  '32',
  '64',
  '128',
  '∞',
];

export const SIZES_SCALE: Array<CardValue> = ['coffee', '?', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '∞'];

export const SCALE_MAPPING: { [id: string]: Array<CardValue> } = {
  FIBONACCI_SCALE: FIBONACCI_SCALE,
  COHEN_SCALE: COHEN_SCALE,
  FIXED_RATIO_SCALE: FIXED_RATIO_SCALE,
  SIZES_SCALE: SIZES_SCALE,
};
