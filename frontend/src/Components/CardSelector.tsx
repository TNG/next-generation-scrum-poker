import classNames from 'classnames';
import { WebSocketApi } from '../types/WebSocket';
import classes from './CardSelector.module.css';
import { IconCoffee } from './IconCoffee';
import { connectToWebSocket } from './WebSocket';
import { IconObserver } from './IconObserver';
import { BUTTON_OBSERVER, VOTE_COFFEE, VOTE_OBSERVER } from '../constants';

const ProtoCardSelector = ({ socket }: { socket: WebSocketApi }) => {
  const selectedCard = socket.state.votes[socket.loginData.user];
  return (
    <>
      <div class={classes.cardCollection}>
        {socket.state.scale.map((cardValue) => (
          <button
            key={cardValue}
            class={classNames([
              classes.largeCard,
              { [classes.selected]: selectedCard === cardValue },
            ])}
            onClick={() => socket.setVote(cardValue)}
          >
            {cardValue === VOTE_COFFEE ? <IconCoffee /> : cardValue}
          </button>
        ))}
      </div>
      <button
        class={classNames([
          classes.buttonObserver,
          { [classes.selected]: selectedCard === VOTE_OBSERVER },
        ])}
        onClick={() => socket.setVote(VOTE_OBSERVER)}
      >
        <IconObserver />
        <div class={classes.buttonObserverText}>{BUTTON_OBSERVER}</div>
      </button>
    </>
  );
};

export const CardSelector = connectToWebSocket(ProtoCardSelector);
