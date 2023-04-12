import { useEffect, useRef, useState } from 'preact/hooks';
import { CardValue } from '../../../../shared/cards';
import { ScaleName, SCALES } from '../../../../shared/scales';
import { SELECT_CHANGE_SCALE } from '../../constants';
import sharedClasses from '../../styles.module.css';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './ScaleSelector.module.css';

const availableScales = Object.entries(SCALES);

export const ScaleSelector = connectToWebSocket(
  ({
    socket: {
      connected,
      setScale,
      state: { scale },
    },
  }) => {
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
        setSelected(availableScales.findIndex(isScaleSelected(scale)) || 0);
        setOpen(true);
      }
    };

    const handleBlur = ({ relatedTarget }: FocusEvent) => {
      if (relatedTarget !== selectionButtonRef.current && relatedTarget !== dropdownRef.current) {
        close();
      }
    };

    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowDown':
          setSelected((selected + 1) % availableScales.length);
          event.preventDefault();
          break;
        case 'ArrowUp':
          setSelected(unsignedModulo(Math.max(selected, 0) - 1, availableScales.length));
          event.preventDefault();
          break;
        case 'Home':
        case 'PageUp':
          setSelected(0);
          break;
        case 'End':
        case 'PageDown':
          setSelected(availableScales.length - 1);
          break;
        case 'Escape':
          close();
          selectionButtonRef.current?.focus();
          break;
        case 'Enter':
        case 'Space':
          // Prevent "enter" from triggering the button if the dropdown is open
          event.preventDefault();
          close();
          selectionButtonRef.current?.focus();
          if (selected >= 0) {
            setScale(availableScales[selected][1].values);
          }
          break;
      }
    };

    useEffect(() => {
      if (!open) {
        return;
      }
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
  }
);

// Unfortunately, the % operator in JavaScript is not a true modulo operator.
// The helper below works for arbitrary dividends even though >= -1 would be sufficient
const unsignedModulo = (dividend: number, divisor: number) =>
  ((dividend % divisor) + divisor) % divisor;

const isScaleSelected =
  (currentScale: CardValue[]) =>
  ([, { values }]: typeof availableScales[number]) =>
    values.length === currentScale.length &&
    values.every((value, index) => value === currentScale[index]);
