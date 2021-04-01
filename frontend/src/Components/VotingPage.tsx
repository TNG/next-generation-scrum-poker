import classNames from 'classnames';
import { useEffect, useState } from 'preact/hooks';
import { SCALE_MAPPING } from '../constants';
import sharedClasses from '../styles.module.css';
import { CardValue, WebSocketApi } from '../types/WebSocket';
import { CoffeeIcon } from './CoffeeIcon';
import classes from './VotingPage.module.css';
import { VotingStateDisplay } from './VotingStateDisplay';
import { connectToWebSocket } from './WebSocket';

const ProtoVotingPage = ({ socket }: { socket: WebSocketApi }) => {
  const [selectedCard, setSelectedCard] = useState<CardValue>(
    socket.state.votes[socket.loginData.user]
  );

  useEffect(() => {
    setSelectedCard(socket.state.votes[socket.loginData.user]);
  }, [socket]);

  return (
    <div className={classes.votingPage}>
      <div className={sharedClasses.heading}>SELECT A CARD</div>
      <div className={classes.cardCollection}>
        {socket.state.scale.map((cardValue) => (
          <button
            key={cardValue}
            className={classNames([
              classes.card,
              { [classes.selectedCard]: cardValue === selectedCard },
            ])}
            onClick={() => {
              setSelectedCard(cardValue);
              socket.setVote(cardValue);
            }}
          >
            {cardValue === 'coffee' ? <CoffeeIcon /> : cardValue}
          </button>
        ))}
      </div>
      <button
        className={classes.button}
        onClick={() => {
          setSelectedCard('observer');
          socket.setVote('observer');
        }}
      >
        Observer
      </button>
      <button className={classes.revealButton} onClick={() => socket.revealVotes()}>
        Reveal Votes
      </button>
      <VotingStateDisplay />
      <button className={classes.button} onClick={() => socket.removeUsersNotVoted()}>
        Kick users without vote
      </button>
      <select
        name="scale"
        className={classes.select}
        onChange={(e) => socket.setScale(SCALE_MAPPING[(e.target as HTMLSelectElement).value])}
        value={'CHANGE_SCALE'}
      >
        <option value="CHANGE_SCALE" disabled>
          Change Scale
        </option>
        <option value="COHEN_SCALE">Cohen</option>
        <option value="FIBONACCI_SCALE">Fibonacci</option>
        <option value="FIXED_RATIO_SCALE">Fixed Ratio</option>
        <option value="SIZES_SCALE">Sizes</option>
      </select>
    </div>
  );
};

export const VotingPage = connectToWebSocket(ProtoVotingPage);
