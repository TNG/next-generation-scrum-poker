import { html } from '../html.js';
import { WebSocketConsumer } from './WebSocket.js';
import { WebSocketApi } from '../types/WebSocket.js';
import { VotingPage } from './VotingPage.js';

export const PageSelector = () =>
  html`<${WebSocketConsumer}>${(value: WebSocketApi) => html`<${VotingPage} />`}<//>`;
