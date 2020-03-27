import { css } from '../css.js';
import { html } from '../html.js';
import { CardValue } from '../types/WebSocket.js';
import { BORDER_RADIUS, TNG_BLUE, TNG_GRAY } from './LoginPage.js';
import { connectToWebSocket } from './WebSocket.js';

const cardStyle = css`
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
`;
const CARD_VALUES: Array<CardValue> = [
  'coffee',
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '20',
  '40',
  '100',
];
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
  align-items: center;
  flex-direction: column;
  .heading {
    color: ${TNG_BLUE};
    font-size: 20px;
    text-align: center;
    line-height: 1.2;
  }
  .card-collection {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .reveal-votes-button {
    border: none;
    color: white;
    cursor: pointer;
    background: ${TNG_BLUE};
    ${BORDER_RADIUS}
    height: 50px;
    width: 150px;
  }
`;
export const VotingPage = connectToWebSocket(
  ({ socket }) => html`<div className=${votingPageStyle}>
    <div className="heading">SELECT A CARD</div>
    <div className="card-collection">
      ${CARD_VALUES.map(
        (cardValue) =>
          html`<${Card} cardValue=${cardValue} setVote=${socket.setVote} key=${cardValue}></${Card}>`
      )}
    </div>
    <button className="reveal-votes-button" onClick=${() => socket.revealVotes()}>
      Reveal Votes
    </button>
  </div>`
);
