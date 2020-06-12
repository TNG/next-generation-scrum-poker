import css from 'csz';
import * as React from 'react';
import { buttonStyle } from '../styles.js';

const copyToClipboardButtonStyles = css`
  ${buttonStyle}
`;

export const CopyToClipboardButton = () => (
  <button
    className={copyToClipboardButtonStyles}
    onClick={() => {
      return navigator.clipboard.writeText(`${location.href}`);
    }}
  >
    Copy Link to Clipboard
  </button>
);
