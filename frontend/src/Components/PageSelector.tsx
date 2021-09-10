import { Footer } from './Footer';
import { Header } from './Header';
import { LoginPage } from './LoginPage/LoginPage';
import { ResultsPage } from './ResultsPage/ResultsPage';
import { VotingPage } from './VotingPage';
import { connectToWebSocket } from './WebSocket';
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
