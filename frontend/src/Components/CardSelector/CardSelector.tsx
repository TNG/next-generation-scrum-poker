import classNames from 'classnames';
import { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { BUTTON_OBSERVER } from '../../constants';
import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../shared/cards';
import { WebSocketApi } from '../../types/WebSocket';
import { IconCoffee } from '../IconCoffee/IconCoffee';
import { IconObserver } from '../IconObserver/IconObserver';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './CardSelector.module.css';

const SPECIAL_ICONS: { [value in CardValue]?: JSX.Element } = {
  [VOTE_OBSERVER]: <IconObserver />,
  [VOTE_COFFEE]: <IconCoffee />,
};
const getCard = (cardValue: CardValue, isSelected: boolean, setVote: WebSocketApi['setVote']) => {
  const isObserver = cardValue === VOTE_OBSERVER;

  return (
    <button
      key={cardValue}
      class={classNames({
        [classes.buttonObserver]: isObserver,
        [classes.largeCard]: !isObserver,
        [classes.selected]: isSelected,
      })}
      onClick={() => setVote(isSelected ? VOTE_NOTE_VOTED : cardValue)}
    >
      {SPECIAL_ICONS[cardValue] || cardValue}
      {isObserver && <div class={classes.buttonObserverText}>{BUTTON_OBSERVER}</div>}
    </button>
  );
};

export const CardSelector = connectToWebSocket(({ socket }) => {
  const selectedCard = socket.state.votes[socket.loginData.user];

  const onKeyDown = ({ key }: KeyboardEvent) => {
    const matchingCards = socket.state.scale.filter(
      (card) => card[0].toLowerCase() === key.toLowerCase()
    );

    if (matchingCards.length) {
      const nextKey = matchingCards[matchingCards.indexOf(selectedCard) + 1] || VOTE_NOTE_VOTED;
      socket.setVote(nextKey);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <>
      <div class={classes.cardCollection}>
        {socket.state.scale.map((cardValue) =>
          getCard(cardValue, selectedCard === cardValue, socket.setVote)
        )}
      </div>
      {getCard(VOTE_OBSERVER, selectedCard === VOTE_OBSERVER, socket.setVote)}
    </>
  );
});
