import { html } from '../html.js';
import { CardValue } from '../types/WebSocket.js';
import { css } from '../css.js';
import { WebSocketConsumer } from './WebSocket.js';

const card = css`
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
  }
  :active {
    background: green;
  }
`;
const CARD_VALUES: Array<CardValue> = ['coffee', '1', '2', '3', '5', '8', '13', '20'];
const Card = (cardValue: CardValue, setVote: (vote: CardValue) => void) =>
  html`<div
    className=${card}
    onClick=${() => {
      setVote(cardValue);
    }}
  >
    ${cardValue}
  </div>`;

const votingPageStyle = css`
  display: flex;
  flex-wrap: wrap;
`;
export const VotingPage = () =>
  html`<${WebSocketConsumer}
    >${(value) =>
      html`<div className=${votingPageStyle}>
        ${CARD_VALUES.map((cardValue) => Card(cardValue, value.setVote))}
      </div>`}<//
  >`;
