import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { WebSocketState } from '../../../../shared/serverMessages';

export const getChartVoteData = ({
  votes,
  scale,
}: Pick<WebSocketState, 'votes' | 'scale'>): {
  data: { labels: CardValue[]; series: [number[]] };
  high: number;
} => {
  const labels = scale.filter(
    (value) => ![VOTE_OBSERVER, VOTE_NOTE_VOTED, VOTE_COFFEE, '?'].includes(value),
  );
  const votesByValue = new Map(labels.map((value) => [value, 0]));
  const otherVotesByValue = new Map<CardValue, number>();

  for (const value of Object.values(votes)) {
    if (labels.includes(value)) {
      votesByValue.set(value, (votesByValue.get(value) ?? 0) + 1);
    }

    if (['?'].includes(value)) {
      otherVotesByValue.set(value, (otherVotesByValue.get(value) ?? 0) + 1);
    }
  }

  const accumulatedVotes = [...votesByValue.entries()];
  const firstVoteIndex = accumulatedVotes.findIndex(([, votes]) => votes !== 0);
  const lastVoteIndex = accumulatedVotes.findLastIndex(([, votes]) => votes !== 0);
  const slicedAccumulatedVotes = [
    ...accumulatedVotes.slice(firstVoteIndex, lastVoteIndex + 1),
    ...otherVotesByValue.entries(),
  ];
  const slicedLabels = slicedAccumulatedVotes.length
    ? [...labels.slice(firstVoteIndex, lastVoteIndex + 1), ...otherVotesByValue.keys()]
    : [...labels, ...otherVotesByValue.keys()];

  const data = slicedAccumulatedVotes.map(([, numberOfVotes]) => numberOfVotes);

  return {
    data: {
      labels: slicedLabels,
      series: [data],
    },
    high: Math.max(1, ...data),
  };
};
