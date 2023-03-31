import { useEffect, useRef, useState } from 'preact/hooks';
import { ScaleName, SCALES } from '../../../../shared/scales';
import { SELECT_CHANGE_SCALE } from '../../constants';
import sharedClasses from '../../styles.module.css';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './ScaleSelector.module.css';

export const ScaleSelector = connectToWebSocket(({ socket: { connected, setScale } }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const scaleSelectorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    if (!connected) {
      setOpen(false);
      return;
    }
    if (dropdownRef.current) {
      dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        scaleSelectorRef.current &&
        event.target instanceof HTMLElement &&
        !isChildNode(event.target, scaleSelectorRef.current)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [open, connected]);

  return (
    <div class={classes.scaleSelector} ref={scaleSelectorRef}>
      <button disabled={!connected} onClick={toggle} class={sharedClasses.button}>
        {SELECT_CHANGE_SCALE}
      </button>
      {open ? (
        <ul class={classes.dropDown} ref={dropdownRef}>
          {Object.entries(SCALES).map(([id, { name }]) => (
            <li
              class={classes.dropDownItem}
              key={id}
              onClick={() => {
                toggle();
                setScale(SCALES[id as ScaleName].values);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

function isChildNode(child: HTMLElement | null, ancestor: HTMLElement): boolean {
  if (!child) {
    return false;
  }
  if (child === ancestor) {
    return true;
  }
  let element: ParentNode | null = child;
  while ((element = element.parentNode)) {
    if (element === ancestor) {
      return true;
    }
  }
  return false;
}
