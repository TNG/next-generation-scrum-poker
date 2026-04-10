import classNames from 'classnames';
import { useEffect, useRef, useState } from 'preact/hooks';
import { CardValue } from '../../../../shared/cards';
import { ScaleName, SCALES } from '../../../../shared/scales';
import { SELECT_CHANGE_SCALE } from '../../constants';
import sharedClasses from '../../styles.module.css';
import { CustomScaleModal } from '../CustomScaleModal/CustomScaleModal';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './ScaleSelector.module.css';

const availableScales = Object.entries(SCALES);
const DROPDOWN_HEIGHT =
  (Object.keys(SCALES).length + 1) * (18.5 /*height*/ + /*padding*/ 8) +
  /*outer padding and border*/ 12 +
  /*distance to button*/ 4;

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
    const [dropdownOnTop, setDropdownOnTop] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const selectionButtonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    const updateDropdownPosition = () => {
      if (selectionButtonRef.current) {
        setDropdownOnTop(
          selectionButtonRef.current.getBoundingClientRect().bottom + DROPDOWN_HEIGHT >
            window.innerHeight,
        );
      }
    };

    const close = () => {
      setOpen(false);
      setSelected(-1);
    };

    const toggle = () => {
      if (open) {
        close();
      } else {
        setSelected(availableScales.findIndex(getScaleMatcher(scale)));
        updateDropdownPosition();
        setOpen(true);
      }
    };

    const handleBlur = ({ relatedTarget }: FocusEvent) => {
      if (relatedTarget !== selectionButtonRef.current && relatedTarget !== dropdownRef.current) {
        close();
      }
    };

    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      const totalOptions = availableScales.length + 1; // +1 for Custom option

      switch (event.code) {
        case 'ArrowDown':
          setSelected((selected) => (selected + 1) % totalOptions);
          event.preventDefault();
          break;
        case 'ArrowUp':
          setSelected((selected) => unsignedModulo(Math.max(selected, 0) - 1, totalOptions));
          event.preventDefault();
          break;
        case 'Home':
        case 'PageUp':
          setSelected(0);
          break;
        case 'End':
        case 'PageDown':
          setSelected(totalOptions - 1);
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
          if (selected >= 0 && selected < availableScales.length) {
            setScale(availableScales[selected][1].values);
          } else if (selected === availableScales.length) {
            // Custom option selected
            setShowCustomModal(true);
          }
          break;
      }
    };

    const handleCustomScaleSave = (customScale: CardValue[]) => {
      setScale(customScale);
      setShowCustomModal(false);
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
            class={classNames(classes.dropDown, dropdownOnTop && classes.onTop)}
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
            <li
              class={classes.dropDownItem}
              key="custom"
              role="option"
              aria-selected={selected === availableScales.length}
              onClick={() => {
                close();
                setShowCustomModal(true);
              }}
              onMouseMove={() =>
                selected !== availableScales.length && setSelected(availableScales.length)
              }
              onMouseLeave={() => selected === availableScales.length && setSelected(-1)}
            >
              Custom
            </li>
          </ul>
        ) : null}
        <CustomScaleModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onSave={handleCustomScaleSave}
        />
      </div>
    );
  },
);

// Unfortunately, the % operator in JavaScript is not a true modulo operator.
// The helper below works for arbitrary dividends even though >= -1 would be sufficient
const unsignedModulo = (dividend: number, divisor: number) =>
  ((dividend % divisor) + divisor) % divisor;

const getScaleMatcher =
  (currentScale: CardValue[]) =>
  ([, { values }]: (typeof availableScales)[number]) =>
    values.length === currentScale.length &&
    values.every((value, index) => value === currentScale[index]);
