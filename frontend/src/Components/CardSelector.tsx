import classNames from 'classnames';
import sharedClasses from '../styles.module.css';
import { WebSocketApi } from '../types/WebSocket';
import classes from './CardSelector.module.css';
import { CoffeeIcon } from './CoffeeIcon';
import { connectToWebSocket } from './WebSocket';

const ProtoCardSelector = ({ socket }: { socket: WebSocketApi }) => {
  const selectedCard = socket.state.votes[socket.loginData.user];
  return (
    <>
      <div className={classes.cardCollection}>
        {socket.state.scale.map((cardValue) => (
          <button
            key={cardValue}
            className={classNames([
              classes.card,
              { [classes.selectedCard]: cardValue === selectedCard },
            ])}
            onClick={() => socket.setVote(cardValue)}
          >
            {cardValue === 'coffee' ? <CoffeeIcon /> : cardValue}
          </button>
        ))}
      </div>
      <button className={sharedClasses.button} onClick={() => socket.setVote('observer')}>
        Observer
      </button>
    </>
  );
};

export const CardSelector = connectToWebSocket(ProtoCardSelector);
