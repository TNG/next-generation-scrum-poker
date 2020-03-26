import { html } from '../html.js';
import { connectToWebSocket } from './WebSocket.js';
import { VotingPage } from './VotingPage.js';

const ProtoPageSelector = ({ socket }) =>
  html`<div>${JSON.stringify(socket)}<${VotingPage} /></div>`;

export const PageSelector = connectToWebSocket(ProtoPageSelector);
