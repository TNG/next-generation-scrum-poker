import classNames from 'classnames';
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
const getCard = (
  cardValue: CardValue,
  isSelected: boolean,
  isObserver: boolean,
  socket: WebSocketApi
) => (
  <button
    key={cardValue}
    class={classNames({
      [classes.buttonObserver]: isObserver,
      [classes.largeCard]: !isObserver,
      [classes.selected]: isSelected,
    })}
    onClick={() => socket.setVote(isSelected ? VOTE_NOTE_VOTED : cardValue)}
  >
    {SPECIAL_ICONS[cardValue] || cardValue}
    {isObserver && <div class={classes.buttonObserverText}>{BUTTON_OBSERVER}</div>}
  </button>
);

const ProtoCardSelector = ({ socket }: { socket: WebSocketApi }) => {
  const selectedCard = socket.state.votes[socket.loginData.user];

  return (
    <>
      <div class={classes.cardCollection}>
        {socket.state.scale.map((cardValue) =>
          getCard(cardValue, selectedCard === cardValue, false, socket)
        )}
      </div>
      {getCard(VOTE_OBSERVER, selectedCard === VOTE_OBSERVER, true, socket)}
    </>
  );
};

export const CardSelector = connectToWebSocket(ProtoCardSelector);
