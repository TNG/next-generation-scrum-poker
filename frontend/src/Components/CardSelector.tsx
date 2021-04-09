import classNames from 'classnames';
import { WebSocketApi } from '../types/WebSocket';
import classes from './CardSelector.module.css';
import { IconCoffee } from './IconCoffee';
import { connectToWebSocket } from './WebSocket';
import { IconObserver } from './IconObserver';

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
            {cardValue === 'coffee' ? <IconCoffee /> : cardValue}
          </button>
        ))}
      </div>
      <button
        class={classNames([
          classes.buttonCard,
          { [classes.selected]: selectedCard === 'observer' },
        ])}
        onClick={() => socket.setVote('observer')}
      >
        <IconObserver />
        <div>Observer</div>
      </button>
    </>
  );
};

export const CardSelector = connectToWebSocket(ProtoCardSelector);
