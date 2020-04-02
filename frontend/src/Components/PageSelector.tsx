import * as React from '/web_modules/react.js';
import { WebSocketApi } from '../types/WebSocket.js';
import { LoginPage } from './LoginPage.js';
import { ResultsPage } from './ResultsPage.js';
import { VotingPage } from './VotingPage.js';
import { connectToWebSocket } from './WebSocket.js';

const ProtoPageSelector = ({ socket }: { socket: WebSocketApi }) => {
  if (!socket.loginData) {
    return <LoginPage />;
  }
  if (socket.state.resultsVisible) {
    return <ResultsPage />;
  }
  return <VotingPage />;
};

export const PageSelector = connectToWebSocket(ProtoPageSelector);
