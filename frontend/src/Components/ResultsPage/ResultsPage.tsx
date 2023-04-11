import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { Votes } from '../../../../shared/serverMessages';
import { COLUMN_NAME, COLUMN_VOTE, HEADING_RESULTS } from '../../constants';
import sharedClasses from '../../styles.module.css';
import { IconCoffee } from '../IconCoffee/IconCoffee';
import { IconNotVoted } from '../IconNotVoted/IconNotVoted';
import { IconObserver } from '../IconObserver/IconObserver';
import { PieChart } from '../PieChart/PieChart';
import { ResetButton } from '../ResetButton/ResetButton';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import { compareVotes } from './compareVotes';
import classes from './ResultsPage.module.css';

const getSortedResultsArray = (unsortedResults: Votes): [string, CardValue][] => {
  const dataArray = Object.entries(unsortedResults);
  return dataArray.sort(compareVotes);
};

const getVote = (vote: CardValue) => {
  if (vote === VOTE_COFFEE) {
    return <IconCoffee />;
  }
  if (vote === VOTE_NOTE_VOTED) {
    return <IconNotVoted />;
  }
  if (vote === VOTE_OBSERVER) {
    return <IconObserver />;
  }
  return vote;
};

const getClassName = (vote: CardValue) =>
  vote === VOTE_NOTE_VOTED || vote === VOTE_OBSERVER ? classes.notVotedEntry : classes.votedEntry;

export const ResultsPage = connectToWebSocket(({ socket }) => (
  <div class={classes.resultsPage}>
    <h1 class={sharedClasses.heading}>{HEADING_RESULTS}</h1>
    <div>
      <PieChart />
    </div>
    <div class={sharedClasses.blueBorder}>
      <table class={sharedClasses.table}>
        <thead>
          <tr class={sharedClasses.headerRow}>
            <th>{COLUMN_NAME}</th>
            <th>{COLUMN_VOTE}</th>
          </tr>
        </thead>
        <tbody>
          {getSortedResultsArray(socket.state.votes).map((userAndVote) => {
            return (
              <tr key={userAndVote[0]}>
                <td>{userAndVote[0]}</td>
                <td class={getClassName(userAndVote[1])}>{getVote(userAndVote[1])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <ResetButton />
  </div>
));
