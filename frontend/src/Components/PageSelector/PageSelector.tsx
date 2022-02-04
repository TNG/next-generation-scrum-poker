import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { LoginPage } from '../LoginPage/LoginPage';
import { ResultsPage } from '../ResultsPage/ResultsPage';
import { VotingPage } from '../VotingPage/VotingPage';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './PageSelector.module.css';

export const PageSelector = connectToWebSocket(({ socket }) => {
  if (!socket.loginData.user || !socket.loggedIn) {
    return <LoginPage />;
  }
  return (
    <div class={classes.pageSelector}>
      <Header />
      {socket.state.resultsVisible ? <ResultsPage /> : <VotingPage />}
      <Footer />
    </div>
  );
});
