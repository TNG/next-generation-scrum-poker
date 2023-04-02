import { useEffect, useRef, useState } from 'preact/hooks';
import { ScaleName, SCALES } from '../../../../shared/scales';
import { SELECT_CHANGE_SCALE } from '../../constants';
import sharedClasses from '../../styles.module.css';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './ScaleSelector.module.css';

const availableScales = Object.entries(SCALES);

export const ScaleSelector = connectToWebSocket(({ socket: { connected, setScale } }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const selectionButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const close = () => {
    setOpen(false);
    setSelected(-1);
  };

  const toggle = () => {
    if (open) {
      close();
    } else {
      setOpen(true);
    }
  };

  const handleBlur = ({ relatedTarget }: FocusEvent) => {
    if (relatedTarget !== selectionButtonRef.current && relatedTarget !== dropdownRef.current) {
      close();
    }
  };

  const handleKeyboardNavigation = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        setSelected((selected + 1) % availableScales.length);
        event.preventDefault();
        break;
      case 'ArrowUp':
        setSelected((Math.max(selected, 0) + availableScales.length - 1) % availableScales.length);
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        // Prevent "enter" from triggering the button if the dropdown is open
        event.preventDefault();
        if (selected >= 0) {
          close();
          setScale(availableScales[selected][1].values);
          selectionButtonRef.current?.focus();
        }
    }
  };

  useEffect(() => {
    if (!open) return;
    if (!connected) {
      close();
      return;
    }
    if (dropdownRef.current) {
      dropdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      dropdownRef.current.focus();
    }
  }, [open, connected]);

  return (
    <div class={classes.scaleSelector}>
      <button
        disabled={!connected}
        onClick={toggle}
        class={sharedClasses.button}
        ref={selectionButtonRef}
        onBlur={handleBlur}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {SELECT_CHANGE_SCALE}
      </button>
      {open ? (
        <ul
          class={classes.dropDown}
          ref={dropdownRef}
          tabIndex={0}
          role="listbox"
          aria-label="scales"
          onBlur={handleBlur}
          onKeyDown={handleKeyboardNavigation}
        >
          {availableScales.map(([id, { name }], index) => (
            <li
              class={classes.dropDownItem}
              key={id}
              role="option"
              aria-selected={selected === index}
              onClick={() => {
                close();
                setScale(SCALES[id as ScaleName].values);
              }}
              onMouseMove={() => selected !== index && setSelected(index)}
              onMouseLeave={() => selected === index && setSelected(-1)}
            >
              {name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
