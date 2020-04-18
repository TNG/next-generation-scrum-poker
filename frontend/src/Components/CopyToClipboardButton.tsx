import * as React from '/web_modules/react.js';

export const CopyToClipboardButton = ({ className }: { className: string }) => (
  <button
    className={className}
    onClick={() => {
      return navigator.clipboard.writeText(`${location.href}`);
    }}
  >
    Copy Link to Clipboard
  </button>
);
