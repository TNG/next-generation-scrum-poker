import css from 'csz';
import * as React from 'react';
import { CARD_VALUES } from '../constants.js';
import { buttonStyle, headingStyle, TNG_BLUE, TNG_GRAY } from '../styles.js';
import { CardValue, WebSocketApi } from '../types/WebSocket.js';
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
    }
  }

  .button {
    ${buttonStyle}
    margin-bottom: 1rem;
  }

  .reveal-button {
    height: 50px;
  }

  .voted {
    color: red;
  }

  .not-voted {
    color: green;
  }
`;

const ProtoVotingPage = ({ socket }: { socket: WebSocketApi }) => {
  const [selectedCard, setSelectedCard] = React.useState<CardValue>('not-voted');
  return (
    <div className={votingPageStyle}>
      <div className="heading">SELECT A CARD</div>
      <div className="card-collection">
        {CARD_VALUES.map((cardValue) => (
          <button
            key={cardValue}
            className={cardValue === selectedCard ? 'card selected-card' : 'card'}
            onClick={() => {
              setSelectedCard(cardValue);
              socket.setVote(cardValue);
            }}
          >
            {cardValue}
          </button>
        ))}
      </div>
      <button className="button reveal-button" onClick={() => socket.revealVotes()}>
        Reveal Votes
      </button>
      <VotingStateDisplay />
      <button className="button" onClick={() => socket.removeUsersNotVoted()}>
        Kick users without vote
      </button>
    </div>
  );
};

export const VotingPage = connectToWebSocket(ProtoVotingPage);
