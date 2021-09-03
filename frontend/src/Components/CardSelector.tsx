import classNames from 'classnames';
import { useEffect } from 'preact/hooks';
import { CardValue, WebSocketApi } from '../types/WebSocket';
import classes from './CardSelector.module.css';
import { IconCoffee } from './IconCoffee';
import { connectToWebSocket } from './WebSocket';
import { IconObserver } from './IconObserver';
import { BUTTON_OBSERVER, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../constants';
import { JSX } from 'preact';

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

function arrayContainsValue<T>(array: T[], value: unknown): value is T {
  return !!array.find(elem => elem === value)
}

const ProtoCardSelector = ({ socket }: { socket: WebSocketApi }) => {
  const selectedCard = socket.state.votes[socket.loginData.user];

  const onKeyDown = ({ key }: KeyboardEvent) => {
    if (arrayContainsValue(socket.state.scale, key)) {
      socket.setVote(key)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    }
  })

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
};

export const CardSelector = connectToWebSocket(ProtoCardSelector);
