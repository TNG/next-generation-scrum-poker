import sharedClasses from '../styles.module.css';
import { BUTTON_COPY_TO_CLIPBOARD } from '../constants';

export const CopyToClipboardButton = () => (
  <button
    class={sharedClasses.button}
    onClick={() => navigator.clipboard.writeText(`${location.href}`)}
  >
    {BUTTON_COPY_TO_CLIPBOARD}
  </button>
);
