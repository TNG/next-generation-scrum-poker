import { FunctionComponent } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { CardValue } from '../../../../shared/cards';
import {
  buildCustomScale,
  getAddCardError,
  MAX_CUSTOM_CARDS,
  normalizeCardValue,
} from '../../../../shared/customScale';
import classes from './CustomScaleModal.module.css';

interface CustomScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scale: CardValue[]) => void;
}

export const CustomScaleModal: FunctionComponent<CustomScaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [cardValues, setCardValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [specialCards, setSpecialCards] = useState({
    infinite: false,
    question: false,
    coffee: false,
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Calculate validation error for current input
  const inputError = useMemo(() => {
    return getAddCardError(inputValue, cardValues);
  }, [inputValue, cardValues]);

  // Build final scale including special cards
  const finalScale = useMemo(() => {
    return buildCustomScale(cardValues, specialCards);
  }, [cardValues, specialCards]);

  // Can save if we have at least one card value
  const canSave = cardValues.length > 0;

  // Can add if input is valid
  const canAdd = inputValue.length > 0 && !inputError;

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement as HTMLElement;
      firstFocusableRef.current?.focus();

      return () => {
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }

    // Focus trap
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Handle input change with normalization
  const handleInputChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    const normalized = normalizeCardValue(value);
    setInputValue(normalized);
  };

  // Handle adding a card
  const handleAddCard = () => {
    if (canAdd) {
      setCardValues([...cardValues, inputValue]);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  // Handle Enter key in input
  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCard();
    }
  };

  // Handle removing a card
  const handleRemoveCard = (index: number) => {
    setCardValues(cardValues.filter((_, i) => i !== index));
  };

  // Handle drag start
  const handleDragStart = (e: DragEvent, index: number) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  // Handle drop
  const handleDrop = (e: DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!e.dataTransfer) return;
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

    if (dragIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newValues = [...cardValues];
    const [removed] = newValues.splice(dragIndex, 1);
    newValues.splice(dropIndex, 0, removed);
    setCardValues(newValues);
    setDraggedIndex(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Handle keyboard reordering
  const handleCardKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      const newValues = [...cardValues];
      [newValues[index - 1], newValues[index]] = [newValues[index], newValues[index - 1]];
      setCardValues(newValues);
    } else if (e.key === 'ArrowDown' && index < cardValues.length - 1) {
      e.preventDefault();
      const newValues = [...cardValues];
      [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];
      setCardValues(newValues);
    }
  };

  // Handle special card toggle
  const toggleSpecialCard = (card: 'infinite' | 'question' | 'coffee') => {
    setSpecialCards({ ...specialCards, [card]: !specialCards[card] });
  };

  // Handle save
  const handleSave = () => {
    if (canSave) {
      onSave(finalScale);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      class={classes.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      <div class={classes.modal}>
        <div class={classes.header}>
          <h2 id="modal-title" class={classes.title}>
            Custom Scale
          </h2>
          <button
            class={classes.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            ref={firstFocusableRef}
          >
            ×
          </button>
        </div>

        <div class={classes.content}>
          {/* Input Section */}
          <div class={classes.inputSection}>
            <label htmlFor="card-input" class={classes.label}>
              Card Value
              <span class={classes.srOnly}>(Maximum 4 alphanumeric characters)</span>
            </label>
            <div class={classes.inputGroup}>
              <input
                id="card-input"
                type="text"
                class={classes.input}
                value={inputValue}
                onInput={handleInputChange}
                onKeyDown={handleInputKeyDown}
                aria-invalid={!!inputError}
                aria-describedby={inputError ? 'input-error' : 'input-hint'}
                maxLength={4}
                placeholder="e.g., XS, M, 1"
                ref={inputRef}
              />
              <button
                class={classes.addButton}
                onClick={handleAddCard}
                disabled={!canAdd}
                aria-label="Add card value"
              >
                Add
              </button>
            </div>
            <div class={classes.inputHint}>
              <span id="input-hint" class={classes.hint}>
                {inputValue.length}/4 characters
              </span>
              {inputError && (
                <span id="input-error" role="alert" class={classes.error}>
                  {inputError}
                </span>
              )}
            </div>
          </div>

          {/* Card List Section */}
          <div class={classes.cardListSection}>
            <div class={classes.cardListHeader}>
              <span class={classes.label}>
                Card Values ({cardValues.length}/{MAX_CUSTOM_CARDS})
              </span>
              {cardValues.length > 0 && (
                <span class={classes.hint}>Drag to reorder or use arrow keys</span>
              )}
            </div>
            {cardValues.length === 0 ? (
              <div class={classes.emptyState}>No cards added yet</div>
            ) : (
              <ul class={classes.cardList} role="list" aria-label="Custom card values">
                {cardValues.map((value, index) => (
                  <li
                    key={`${value}-${index}`}
                    class={`${classes.cardItem} ${draggedIndex === index ? classes.dragging : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onKeyDown={(e) => handleCardKeyDown(e, index)}
                    tabIndex={0}
                    role="listitem"
                    aria-label={`Card value ${value}, position ${index + 1} of ${cardValues.length}. Press arrow keys to reorder.`}
                  >
                    <span class={classes.dragHandle} aria-hidden="true">
                      ☰
                    </span>
                    <span class={classes.cardValue}>{value}</span>
                    <button
                      class={classes.removeButton}
                      onClick={() => handleRemoveCard(index)}
                      aria-label={`Remove ${value}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Special Cards Section */}
          <div class={classes.specialCardsSection}>
            <span class={classes.label}>Special Cards</span>
            <div class={classes.specialCardButtons}>
              <button
                class={`${classes.specialCardButton} ${specialCards.infinite ? classes.active : ''}`}
                onClick={() => toggleSpecialCard('infinite')}
                aria-pressed={specialCards.infinite}
                aria-label="Toggle infinite card"
              >
                <span class={classes.specialCardIcon}>∞</span>
                <span class={classes.specialCardLabel}>Infinite</span>
              </button>
              <button
                class={`${classes.specialCardButton} ${specialCards.question ? classes.active : ''}`}
                onClick={() => toggleSpecialCard('question')}
                aria-pressed={specialCards.question}
                aria-label="Toggle question card"
              >
                <span class={classes.specialCardIcon}>?</span>
                <span class={classes.specialCardLabel}>Question</span>
              </button>
              <button
                class={`${classes.specialCardButton} ${specialCards.coffee ? classes.active : ''}`}
                onClick={() => toggleSpecialCard('coffee')}
                aria-pressed={specialCards.coffee}
                aria-label="Toggle coffee card"
              >
                <span class={classes.specialCardIcon}>☕</span>
                <span class={classes.specialCardLabel}>Coffee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class={classes.footer}>
          <button class={classes.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button class={classes.saveButton} onClick={handleSave} disabled={!canSave}>
            Save Scale
          </button>
        </div>
      </div>
    </div>
  );
};
