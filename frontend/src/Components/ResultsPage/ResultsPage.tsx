import { Suspense, lazy } from 'preact/compat';
import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import {
  COLUMN_NAME,
  COLUMN_VOTE,
  HEADING_RESULTS,
  TOOLTIP_PENDING_CONNECTION,
} from '../../constants';
import { compareVotes } from '../../helpers/compareVotes';
import { UserState, getVotingState } from '../../helpers/getVotingState';
import sharedClasses from '../../styles.module.css';
import { WebSocketApi } from '../../types/WebSocket';
import { IconCoffee } from '../IconCoffee/IconCoffee';
import { IconNotVoted } from '../IconNotVoted/IconNotVoted';
import { IconObserver } from '../IconObserver/IconObserver';
import { ResetButton } from '../ResetButton/ResetButton';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './ResultsPage.module.css';

const getSortedResultsArray = (socket: WebSocketApi): UserState[] => {
  return getVotingState(socket).sort(compareVotes);
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

const BarChart = lazy(() => import('../BarChart/BarChart').then((value) => value.BarChart));

export const ResultsPage = connectToWebSocket(({ socket }) => {
  return (
    <div class={classes.resultsPage}>
      <h1 class={sharedClasses.heading}>{HEADING_RESULTS}</h1>
      <Suspense fallback={<p className={classes.loading}>Loading...</p>}>
        <BarChart />
      </Suspense>
      <div class={sharedClasses.blueBorder}>
        <table class={sharedClasses.table}>
          <thead>
            <tr class={sharedClasses.headerRow}>
              <th>{COLUMN_NAME}</th>
              <th>{COLUMN_VOTE}</th>
            </tr>
          </thead>
          <tbody>
            {getSortedResultsArray(socket).map(({ user, vote, pendingConnection }) => (
              <tr key={user}>
                <td
                  class={pendingConnection ? classes.pendingConnection : undefined}
                  title={pendingConnection ? TOOLTIP_PENDING_CONNECTION : undefined}
                >
                  {user}
                </td>
                <td class={getClassName(vote)}>{getVote(vote)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResetButton />
    </div>
  );
});
