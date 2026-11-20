import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { CardValue, VOTE_COFFEE } from '../../../../shared/cards';
import { buildCustomScale, isValidCustomCardValue } from '../../../../shared/customScale';
import sharedClasses from '../../styles.module.css';
import { Modal } from '../Modal/Modal';
import { CardValueInput } from './CardValueInput';
import { CardValueList } from './CardValueList';
import classes from './CustomScaleModal.module.css';

const SPECIAL_CARD_TOGGLES = [
  { key: 'infinite', icon: '∞', label: 'Infinite' },
  { key: 'question', icon: '?', label: 'Question' },
  { key: 'coffee', icon: '☕', label: 'Coffee' },
] as const;

type SpecialCardKey = (typeof SPECIAL_CARD_TOGGLES)[number]['key'];

interface CustomScaleModalProps {
  initialScale: CardValue[];
  onClose: () => void;
  onSave: (scale: CardValue[]) => void;
}

export const CustomScaleModal: FunctionComponent<CustomScaleModalProps> = ({
  initialScale,
  onClose,
  onSave,
}) => {
  const [cardValues, setCardValues] = useState<string[]>(() =>
    initialScale.filter(isValidCustomCardValue),
  );
  const [specialCards, setSpecialCards] = useState<Record<SpecialCardKey, boolean>>(() => ({
    infinite: initialScale.includes('∞'),
    question: initialScale.includes('?'),
    coffee: initialScale.includes(VOTE_COFFEE),
  }));

  const canSave = cardValues.length > 0;

  const toggleSpecialCard = (card: SpecialCardKey) => {
    setSpecialCards({ ...specialCards, [card]: !specialCards[card] });
  };

  const handleSave = () => {
    if (canSave) {
      onSave(buildCustomScale(cardValues, specialCards));
    }
  };

  return (
    <Modal title="Custom Scale" onClose={onClose}>
      <div class={classes.content}>
        <CardValueInput
          existingValues={cardValues}
          onAdd={(value) => setCardValues([...cardValues, value])}
        />
        <CardValueList values={cardValues} onChange={setCardValues} />
        <div class={classes.specialCardsSection}>
          <span class={sharedClasses.label}>Special Cards</span>
          <div class={classes.specialCardButtons}>
            {SPECIAL_CARD_TOGGLES.map(({ key, icon, label }) => (
              <button
                key={key}
                class={`${classes.specialCardButton} ${specialCards[key] ? classes.active : ''}`}
                onClick={() => toggleSpecialCard(key)}
                aria-pressed={specialCards[key]}
                aria-label={`Toggle ${label.toLowerCase()} card`}
              >
                <span class={classes.specialCardIcon}>{icon}</span>
                <span class={classes.specialCardLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div class={classes.footer}>
        <button class={classes.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button class={classes.saveButton} onClick={handleSave} disabled={!canSave}>
          Save Scale
        </button>
      </div>
    </Modal>
  );
};
