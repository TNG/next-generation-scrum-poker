import sharedClasses from '../../styles.module.css';
import { CardValue, Votes, WebSocketApi } from '../../types/WebSocket';
import { IconCoffee } from '../IconCoffee';
import { IconNotVoted } from '../IconNotVoted';
import { IconObserver } from '../IconObserver';
import { connectToWebSocket } from '../WebSocket';
import { compareVotes } from './compareVotes';
import classes from './ResultsPage.module.css';

const getSortedResultsArray = (unsortedResults: Votes) => {
  let dataArray: [string, CardValue][] = Object.entries(unsortedResults);
  return dataArray.sort(compareVotes);
};

const getVote = (vote: CardValue) => {
  if (vote === 'coffee') {
    return <IconCoffee />;
  }
  if (vote === 'not-voted') {
    return <IconNotVoted />;
  }
  if (vote === 'observer') {
    return <IconObserver />;
  }
  return vote;
};

const getClass = (vote: CardValue) =>
  vote === 'not-voted' || vote === 'observer' ? classes.notVotedEntry : classes.votedEntry;

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) => (
  <div class={classes.resultsPage}>
    <div class={sharedClasses.heading}>RESULTS</div>
    <div class={sharedClasses.blueBorder}>
      <table class={sharedClasses.table}>
        <thead>
          <tr class={sharedClasses.headerRow}>
            <th>Name</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {getSortedResultsArray(socket.state.votes).map((userAndVote) => {
            return (
              <tr key={userAndVote[0]}>
                <td>{userAndVote[0]}</td>
                <td class={getClass(userAndVote[1])}>{getVote(userAndVote[1])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <button
      class={sharedClasses.button}
      onClick={() => {
        socket.resetVotes();
      }}
    >
      Reset votes
    </button>
  </div>
);

export const ResultsPage = connectToWebSocket(ProtoResultsPage);
