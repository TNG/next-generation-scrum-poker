import css from 'csz';
import { useEffect, useState } from 'preact/hooks';
import { SCALE_MAPPING } from '../constants';
import { buttonStyle, headingStyle, TNG_BLUE, TNG_GRAY } from '../styles.js';
import { CardValue, WebSocketApi } from '../types/WebSocket.js';
import { CoffeeIcon } from './CoffeeIcon';
import { VotingStateDisplay } from './VotingStateDisplay.js';
import { connectToWebSocket } from './WebSocket.js';

const votingPageStyle = css`
  display: flex;
  align-items: center;
  flex-direction: column;

  .heading {
    ${headingStyle}
  }

  .card-collection {
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 900px;
  }

  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 3px;
    border-style: solid;
    border-color: ${TNG_BLUE};
    border-radius: 10px;
    color: ${TNG_BLUE};
    fill: ${TNG_BLUE};
    height: 160px;
    width: 100px;
    margin: 10px;
    cursor: pointer;
    font-size: 20px;

    :hover {
      background: ${TNG_GRAY};
    }

    :active,
    &.selected-card {
      background: ${TNG_BLUE};
      color: white;
      fill: white;
    }

    :focus {
      outline: 2px dashed ${TNG_BLUE};
      outline-offset: 2px;
    }
  }

  .button {
    ${buttonStyle}
    margin-bottom: 1rem;
  }

  .select {
    ${buttonStyle}
    margin-bottom: 1rem;
    padding-left: 8px;
  }

  .reveal-button {
    height: 50px;
  }

  .voted {
    color: green;
    fill: green;
  }

  .not-voted {
    color: red;
    fill: red;
  }

  .observer {
    color: ${TNG_BLUE};
    fill: ${TNG_BLUE};
  }
`;

const ProtoVotingPage = ({ socket }: { socket: WebSocketApi }) => {
  const [selectedCard, setSelectedCard] = useState<CardValue>(
    socket.state.votes[socket.loginData.user]
  );

  useEffect(() => {
    setSelectedCard(socket.state.votes[socket.loginData.user]);
  }, [socket]);

  return (
    <div className={votingPageStyle}>
      <div className="heading">SELECT A CARD</div>
      <div className="card-collection">
        {socket.state.scale.map((cardValue) => (
          <button
            key={cardValue}
            className={cardValue === selectedCard ? 'card selected-card' : 'card'}
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
        className="button observer-button"
        onClick={() => {
          setSelectedCard('observer');
          socket.setVote('observer');
        }}
      >
        Observer
      </button>
      <button className="button reveal-button" onClick={() => socket.revealVotes()}>
        Reveal Votes
      </button>
      <VotingStateDisplay />
      <button className="button" onClick={() => socket.removeUsersNotVoted()}>
        Kick users without vote
      </button>
      <select
        name="scale"
        className="select"
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
