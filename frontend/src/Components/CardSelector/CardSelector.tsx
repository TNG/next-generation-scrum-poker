import classNames from 'classnames';
import { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { BUTTON_OBSERVER } from '../../constants';
import { WebSocketApi } from '../../types/WebSocket';
import { IconCoffee } from '../IconCoffee/IconCoffee';
import { IconObserver } from '../IconObserver/IconObserver';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './CardSelector.module.css';

const SPECIAL_ICONS: Partial<Record<CardValue, JSX.Element>> = {
  [VOTE_OBSERVER]: <IconObserver />,
  [VOTE_COFFEE]: <IconCoffee />,
};

const getCard = (
  cardValue: CardValue,
  isSelected: boolean,
  setVote: WebSocketApi['setVote'],
  enabled: boolean,
) => {
  const isObserver = cardValue === VOTE_OBSERVER;

  return (
    <button
      disabled={!enabled}
      key={cardValue}
      class={classNames({
        [classes.buttonObserver]: isObserver,
        [classes.largeCard]: !isObserver,
        [classes.selected]: isSelected,
      })}
      aria-selected={isSelected}
      aria-label={cardValue}
      role="option"
      onClick={() => setVote(isSelected ? VOTE_NOTE_VOTED : cardValue)}
    >
      {SPECIAL_ICONS[cardValue] || cardValue}
      {isObserver && <div class={classes.buttonObserverText}>{BUTTON_OBSERVER}</div>}
    </button>
  );
};

export const CardSelector = connectToWebSocket(
  ({ socket: { connected, loginData, setVote, state } }) => {
    const selectedCard = state.votes[loginData.user];

    const onKeyDown = ({ key, ctrlKey, altKey, metaKey }: KeyboardEvent) => {
      // We don't check for 'shiftKey' because it is used for the question mark
      if (ctrlKey || altKey || metaKey) {
        return;
      }

      const matchingCards = state.scale.filter(
        (card) => card[0].toLowerCase() === key.toLowerCase(),
      );

      if (matchingCards.length) {
        const nextKey = matchingCards[matchingCards.indexOf(selectedCard) + 1] || VOTE_NOTE_VOTED;
        setVote(nextKey);
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', onKeyDown);

      return () => {
        window.removeEventListener('keydown', onKeyDown);
      };
    });

    return (
      <div class={classes.cardCollectionWrapper} role="listbox" aria-label="selectable cards">
        <div class={classes.cardCollection}>
          {state.scale.map((cardValue) =>
            getCard(cardValue, selectedCard === cardValue, setVote, connected),
          )}
        </div>
        {getCard(VOTE_OBSERVER, selectedCard === VOTE_OBSERVER, setVote, connected)}
      </div>
    );
  },
);
