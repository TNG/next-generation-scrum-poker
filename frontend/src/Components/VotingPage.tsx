import { CARD_VALUES } from '../config.js';
import { css } from '../css.js';
import { Votes, WebSocketApi } from '../types/WebSocket.js';
import { BORDER_RADIUS, TNG_BLUE, TNG_GRAY } from '../styles.js';
import React from '../react.js';
import { connectToWebSocket } from './WebSocket.js';

const votingPageStyle = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  .heading {
    color: ${TNG_BLUE};
    font-size: 20px;
    text-align: center;
    line-height: 1.2;
  }
  .login-info {
    font-size: 12px;
    margin-left: 2rem;
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
    :hover {
      background: ${TNG_GRAY};
      cursor: pointer;
    }
    :active {
      background: ${TNG_BLUE};
      color: white;
    }
  }
  .selected-card {
    background: ${TNG_BLUE};
    color: white;
  }
  .button {
    border: none;
    color: white;
    cursor: pointer;
    background: ${TNG_BLUE};
    ${BORDER_RADIUS};
    height: 50px;
    width: 150px;
    :hover {
      background: ${TNG_GRAY};
    }
  }
  .table {
    text-align: left;
    padding: 15px;
    border-width: 3px;
    border-style: solid;
    border-color: ${TNG_BLUE};
    ${BORDER_RADIUS};
    margin: 10px;
  }
  .header-row {
    color: ${TNG_BLUE};
    padding 25px;
  }
  .voted {
    color: red;
  }
  .not-voted {
    color: green;
  }
`;
const getSortedVotingState = (votes: Votes) => {
  const votedUsers = Object.keys(votes).map((user) => ({
    user,
    voted: votes[user] === 'not-voted',
  }));
  return votedUsers.sort((a, b) => (a.voted ? -1 : 1));
};

const ProtoVotingPage = ({socket}: { socket: WebSocketApi }) => {
  const [selectedCard, setSelectedCard] = React.useState(null);
  return <>
    <div className="login-info">
      <p>Session ID: {socket.loginData ? socket.loginData.session : 'not found'}</p>
      <p>User name: {socket.loginData ? socket.loginData.user : 'not found'}</p>
    </div>
    <div className={votingPageStyle}>
      <div className="heading">SELECT A CARD</div>
      <div className="card-collection">
        {CARD_VALUES.map(
            (cardValue) =>
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
        )}
      </div>
      <button className="button" onClick={() => socket.revealVotes()}>
        Reveal Votes
      </button>

      <table className="table">
        <thead>
        <tr className="header-row">
          <th>Name</th>
          <th>Voted</th>
        </tr>
        </thead>
        <tbody>
        {getSortedVotingState(socket.state.votes).map(({user, voted}) => {
          return <tr key={user}>
            <td className={voted ? 'voted' : 'not-voted'}>{user}</td>
            <td align="center" className={voted ? 'voted' : 'not-voted'}>{voted ? '✗' : '✔'}</td>
          </tr>;
        })}
        </tbody>
      </table>
    </div>
  </>;
};

export const VotingPage = connectToWebSocket(ProtoVotingPage);
