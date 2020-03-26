import { html } from '../html.js';
import { connectToWebSocket } from './WebSocket.js';
import { VotingPage } from './VotingPage.js';
import { ResultsPage } from './ResultsPage.js';
import { WebSocketApi } from '../types/WebSocket.js';

const ProtoPageSelector = ({ socket }: { socket: WebSocketApi }) => {
  if (socket.state.resultsVisible) {
    return html`<${ResultsPage} />`;
  }
  return html`<${VotingPage} />`;
};

export const PageSelector = connectToWebSocket(ProtoPageSelector);
