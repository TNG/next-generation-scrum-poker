import sharedClasses from '../styles.module.css';

export const CopyToClipboardButton = () => (
  <button
    class={sharedClasses.button}
    onClick={() => navigator.clipboard.writeText(`${location.href}`)}
  >
    Copy Link to Clipboard
  </button>
);
