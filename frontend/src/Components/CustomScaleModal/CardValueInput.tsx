import { FunctionComponent } from 'preact';
import { useId, useRef, useState } from 'preact/hooks';
import {
  getAddCardError,
  MAX_CARD_VALUE_LENGTH,
  normalizeCardValue,
} from '../../../../shared/customScale';
import sharedClasses from '../../styles.module.css';
import classes from './CardValueInput.module.css';

interface CardValueInputProps {
  existingValues: string[];
  onAdd: (value: string) => void;
}

export const CardValueInput: FunctionComponent<CardValueInputProps> = ({
  existingValues,
  onAdd,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const inputError = getAddCardError(inputValue, existingValues);
  const canAdd = inputValue.length > 0 && !inputError;

  const handleInput = (e: Event) => {
    setInputValue(normalizeCardValue((e.target as HTMLInputElement).value));
  };

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd(inputValue);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div class={classes.inputSection}>
      <label htmlFor={inputId} class={sharedClasses.label}>
        Card Value
        <span class={sharedClasses.srOnly}>
          (Maximum {MAX_CARD_VALUE_LENGTH} alphanumeric characters)
        </span>
      </label>
      <div class={classes.inputGroup}>
        <input
          id={inputId}
          type="text"
          class={classes.input}
          value={inputValue}
          onInput={handleInput}
          onKeyDown={handleInputKeyDown}
          aria-invalid={!!inputError}
          aria-describedby={inputError ? errorId : hintId}
          maxLength={MAX_CARD_VALUE_LENGTH}
          placeholder="e.g., XS, M, 1"
          ref={inputRef}
        />
        <button
          class={classes.addButton}
          onClick={handleAdd}
          disabled={!canAdd}
          aria-label="Add card value"
        >
          Add
        </button>
      </div>
      <div class={classes.inputHint}>
        <span id={hintId} class={sharedClasses.hint}>
          {inputValue.length}/{MAX_CARD_VALUE_LENGTH} characters
        </span>
        {inputError && (
          <span id={errorId} role="alert" class={classes.error}>
            {inputError}
          </span>
        )}
      </div>
    </div>
  );
};
