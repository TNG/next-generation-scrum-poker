import { CardValue, VOTE_COFFEE } from './shared/WebSocketMessages';

export const TNG_URL = 'https://www.tngtech.com/en';

// Scales
export const SCALES: { [id: string]: { name: string; values: Array<CardValue> } } = {
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

// Text constants
export const APP_NAME_FIRST = 'NEXT GENERATION';
export const APP_NAME_SECOND = 'SCRUM POKER';
export const HEADING_SELECT_CARD = 'SELECT A CARD';
export const HEADING_RESULTS = 'RESULTS';

export const LABEL_USERNAME = 'Name:';
export const LABEL_SESSION = 'Session:';

export const BUTTON_LOGIN = 'Login';
export const BUTTON_CONNECTING = 'Connecting…';
export const BUTTON_OBSERVER = 'Observer';
export const BUTTON_REVEAL_VOTES = 'Reveal Votes';
export const BUTTON_REVEAL_NOW = 'Reveal Now';
export const BUTTON_KICK_NOT_VOTED = 'Kick users without vote';
export const BUTTON_COPY_TO_CLIPBOARD = 'Copy Link to Clipboard';
export const SELECT_CHANGE_SCALE = 'Change Scale';

export const ALT_TNG_LOGO = 'TNG Logo';

export const TOOLTIP_COFFEE = 'Need a break';
export const TOOLTIP_NOT_VOTED = 'Not voted';
export const TOOLTIP_OBSERVER = 'Observer';
export const TOOLTIP_VOTED = 'Voted';

export const COLUMN_NAME = 'Name';
export const COLUMN_VOTE = 'Vote';
export const COLUMN_VOTED = 'Voted';

export const SWITCH_TO_DARK = 'Switch to dark color mode';
export const SWITCH_TO_LIGHT = 'Switch to light color mode';
