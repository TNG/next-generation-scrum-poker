import sharedClasses from '../../styles.module.css';
import { CardValue, Votes, WebSocketApi } from '../../types/WebSocket';
import { CoffeeIcon } from '../CoffeeIcon';
import { NotVotedIcon } from '../NotVotedIcon';
import { ObserverIcon } from '../ObserverIcon';
import { connectToWebSocket } from '../WebSocket';
import { compareVotes } from './compareVotes';
import classes from './ResultsPage.module.css';

const getSortedResultsArray = (unsortedResults: Votes) => {
  let dataArray: [string, CardValue][] = Object.entries(unsortedResults);
  return dataArray.sort(compareVotes);
};

const getVote = (vote: CardValue) => {
  if (vote === 'coffee') {
    return <CoffeeIcon />;
  }
  if (vote === 'not-voted') {
    return <NotVotedIcon />;
  }
  if (vote === 'observer') {
    return <ObserverIcon />;
  }
  return vote;
};

const getClassName = (vote: CardValue) =>
  vote === 'not-voted' || vote === 'observer' ? classes.notVotedEntry : classes.votedEntry;

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) => (
  <div className={classes.resultsPage}>
    <div className={sharedClasses.heading}>RESULTS</div>
    <div className={sharedClasses.blueBorder}>
      <table className={sharedClasses.table}>
        <thead>
          <tr className={sharedClasses.headerRow}>
            <th>Name</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {getSortedResultsArray(socket.state.votes).map((userAndVote) => {
            return (
              <tr key={userAndVote[0]}>
                <td>{userAndVote[0]}</td>
                <td className={getClassName(userAndVote[1])}>{getVote(userAndVote[1])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <button
      className={sharedClasses.button}
      onClick={() => {
        socket.resetVotes();
      }}
    >
      Reset votes
    </button>
  </div>
);

export const ResultsPage = connectToWebSocket(ProtoResultsPage);
