import { WebSocketApi } from '../types/WebSocket';
import { LoginInfo } from './LoginInfo';
import { LoginPage } from './LoginPage/LoginPage';
import { ResultsPage } from './ResultsPage/ResultsPage';
import { VotingPage } from './VotingPage';
import { connectToWebSocket } from './WebSocket';

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
