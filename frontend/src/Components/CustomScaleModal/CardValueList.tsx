import { FunctionComponent } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { MAX_CUSTOM_CARDS } from '../../../../shared/customScale';
import sharedClasses from '../../styles.module.css';
import classes from './CardValueList.module.css';

interface CardValueListProps {
  values: string[];
  onChange: (values: string[]) => void;
}

const moveCardValue = (values: string[], from: number, to: number): string[] => {
  const newValues = [...values];
  const [movedValue] = newValues.splice(from, 1);
  newValues.splice(to, 0, movedValue);
  return newValues;
};

export const CardValueList: FunctionComponent<CardValueListProps> = ({ values, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Re-focus the moved card at its new position after the DOM updates.
  // Reordering via key-based reconciliation can drop focus when a node is
  // removed and reinserted rather than simply moved.
  const refocusCard = (newIndex: number) => {
    requestAnimationFrame(() => {
      (listRef.current?.children[newIndex] as HTMLElement | undefined)?.focus();
    });
  };

  const handleDragStart = (e: DragEvent, index: number) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: DragEvent, dropIndex: number) => {
    e.preventDefault();
    // The dragged index is tracked in state instead of read from the
    // dataTransfer, so drops of external content are ignored. The dataTransfer
    // payload set in handleDragStart only exists to keep browsers treating
    // this as a valid drag.
    if (draggedIndex === null || draggedIndex === dropIndex || draggedIndex >= values.length) {
      setDraggedIndex(null);
      return;
    }

    onChange(moveCardValue(values, draggedIndex, dropIndex));
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleCardKeyDown = (e: KeyboardEvent, index: number) => {
    // Ignore keys bubbling up from the nested remove button
    if (e.target !== e.currentTarget) {
      return;
    }
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      onChange(moveCardValue(values, index, index - 1));
      refocusCard(index - 1);
    } else if (e.key === 'ArrowDown' && index < values.length - 1) {
      e.preventDefault();
      onChange(moveCardValue(values, index, index + 1));
      refocusCard(index + 1);
    }
  };

  const handleRemoveCard = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div class={classes.cardListSection}>
      <div class={classes.cardListHeader}>
        <span class={sharedClasses.label}>
          Card Values ({values.length}/{MAX_CUSTOM_CARDS})
        </span>
        {values.length > 0 && (
          <span class={sharedClasses.hint}>Drag to reorder or use arrow keys</span>
        )}
      </div>
      {values.length === 0 ? (
        <div class={classes.emptyState}>No cards added yet</div>
      ) : (
        <ul class={classes.cardList} role="list" aria-label="Custom card values" ref={listRef}>
          {values.map((value, index) => (
            <li
              key={value}
              class={`${classes.cardItem} ${draggedIndex === index ? classes.dragging : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onKeyDown={(e) => handleCardKeyDown(e, index)}
              tabIndex={0}
              role="listitem"
              aria-label={`Card value ${value}, position ${index + 1} of ${values.length}. Press arrow keys to reorder.`}
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
  );
};
