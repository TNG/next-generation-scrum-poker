import * as React from '/web_modules/react.js';
import { WebSocketApi } from '../types/WebSocket.js';
import { LoginInfo } from './LoginInfo.js';
import { LoginPage } from './LoginPage.js';
import { ResultsPage } from './ResultsPage/ResultsPage.js';
import { VotingPage } from './VotingPage.js';
import { connectToWebSocket } from './WebSocket.js';

const ProtoPageSelector = ({ socket }: { socket: WebSocketApi }) => {
  if (!socket.loginData.user || !socket.loggedIn) {
    return <LoginPage />;
  }
  if (socket.state.resultsVisible) {
    return (
      <>
        <LoginInfo />
        <ResultsPage />
      </>
    );
  }
  return (
    <>
      <LoginInfo />
      <VotingPage />
    </>
  );
};

export const PageSelector = connectToWebSocket(ProtoPageSelector);
