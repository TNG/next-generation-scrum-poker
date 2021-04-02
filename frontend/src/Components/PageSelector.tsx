import { WebSocketApi } from '../types/WebSocket';
import { Footer } from './Footer';
import { Header } from './Header';
import { LoginPage } from './LoginPage/LoginPage';
import { ResultsPage } from './ResultsPage/ResultsPage';
import { VotingPage } from './VotingPage';
import { connectToWebSocket } from './WebSocket';

const ProtoPageSelector = ({ socket }: { socket: WebSocketApi }) => {
  if (!socket.loginData.user || !socket.loggedIn) {
    return <LoginPage />;
  }
  return (
    <>
      <Header />
      {socket.state.resultsVisible ? <ResultsPage /> : <VotingPage />}
      <Footer />
    </>
  );
};

export const PageSelector = connectToWebSocket(ProtoPageSelector);
