import { css } from '../css.js';
import { html } from '../html.js';
import { CardValue } from '../types/WebSocket.js';
import { connectToWebSocket } from './WebSocket.js';

const cardStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 3px;
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  height: 200px;
  width: 100px;
  margin: 10px;
  :hover {
    background: #e1e1e1;
    cursor: pointer;
  }
  :active {
    background: green;
  }
`;
const CARD_VALUES: Array<CardValue> = ['coffee', '1', '2', '3', '5', '8', '13', '20'];
const Card = ({
  cardValue,
  setVote,
}: {
  cardValue: CardValue;
  setVote: (vote: CardValue) => void;
}) =>
  html`<div
    className=${cardStyle}
    onClick=${() => {
      setVote(cardValue);
    }}
  >
    ${cardValue}
  </div>`;

const votingPageStyle = css`
  display: flex;
  flex-direction: column;
`;
const cardCollectionStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const VotingPage = connectToWebSocket(
  ({ socket }) => html`<div className=${votingPageStyle}>
    <div className=${cardCollectionStyle}>
      ${CARD_VALUES.map(
        (cardValue) =>
          html`<${Card} cardValue=${cardValue} setVote=${socket.setVote} key=${cardValue}></${Card}>`
      )}
    </div>
    <button onClick=${() => socket.revealVotes()}>Reveal Votes</button>
  </div>`
);
