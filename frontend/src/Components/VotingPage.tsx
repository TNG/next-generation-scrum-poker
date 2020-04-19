import css from '/web_modules/csz.js';
import * as React from '/web_modules/react.js';
import { CARD_VALUES } from '../constants.js';
import { buttonStyle, headingStyle, TNG_BLUE, TNG_GRAY } from '../styles.js';
import { CardValue, WebSocketApi } from '../types/WebSocket.js';
import { CopyToClipboardButton } from './CopyToClipboardButton.js';
import { VotingStateDisplay } from './VotingStateDisplay.js';
import { connectToWebSocket } from './WebSocket.js';

const votingPageStyle = css`
  display: flex;
  align-items: center;
  flex-direction: column;

  .heading {
    ${headingStyle};
  }

  .login-info {
    color: ${TNG_GRAY};
    font-size: 12px;
    margin-bottom: 1rem;
  }

  .card-collection {
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
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

    :active {
      background: ${TNG_BLUE};
      color: white;

      :hover {
        border-color: ${TNG_GRAY};
      }
    }
  }

  .selected-card {
    background: ${TNG_BLUE};
    color: white;

    :hover {
      background: ${TNG_BLUE};
      border-color: ${TNG_GRAY};
    }
  }

  .button {
    ${buttonStyle};
    margin: 10px;
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
      <div className="login-info">
        Session ID: {socket.loginData ? socket.loginData.session : 'not found'} &nbsp; - &nbsp; User
        name: {socket.loginData ? socket.loginData.user : 'not found'}
      </div>
      <div className="heading">SELECT A CARD</div>
      <div className="card-collection">
        {CARD_VALUES.map((cardValue) => (
          <div
            key={cardValue}
            className={cardValue === selectedCard ? 'card selected-card' : 'card'}
            onClick={() => {
              setSelectedCard(cardValue);
              socket.setVote(cardValue);
            }}
          >
            {cardValue}
          </div>
        ))}
      </div>
      <button className="button" onClick={() => socket.revealVotes()}>
        Reveal Votes
      </button>
      <VotingStateDisplay />
      <button className="button" onClick={() => socket.removeUsersNotVoted()}>
        Kick users without vote
      </button>
      <CopyToClipboardButton className="button" />
    </div>
  );
};

export const VotingPage = connectToWebSocket(ProtoVotingPage);
