import classNames from 'classnames';
import { JSX } from 'preact';
import { useState } from 'preact/hooks';

export const TouchDetector = ({ children }: { children: JSX.Element }) => {
  const [usesTouch, setUsesTouch] = useState<boolean>(false);
  return (
    <div class={classNames({ 'no-touch': !usesTouch })} onTouchStart={() => setUsesTouch(true)}>
      {children}
    </div>
  );
};
