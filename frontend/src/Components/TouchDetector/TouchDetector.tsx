import classNames from 'classnames';
import { useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';

export const TouchDetector = ({ children }: { children: JSXInternal.Element }) => {
  const [usesTouch, setUsesTouch] = useState<boolean>(false);
  return (
    <div class={classNames({ 'no-touch': !usesTouch })} onTouchStart={() => setUsesTouch(true)}>
      {children}
    </div>
  );
};
