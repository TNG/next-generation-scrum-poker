import { ChartDataset } from 'chart.js';
import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { WebSocketState } from '../../../../shared/serverMessages';
import { compareCardValues } from '../../helpers/compareVotes';

export const getChartVoteData = ({
  votes,
  scale,
}: Pick<WebSocketState, 'votes' | 'scale'>): {
  labels: CardValue[];
  datasets: ChartDataset<'bar', number[]>[];
} => {
  const labels = scale.filter(
    (value) => ![VOTE_OBSERVER, VOTE_NOTE_VOTED, VOTE_COFFEE].includes(value),
  );
  const votesByValue: Partial<Record<CardValue, number>> = Object.fromEntries(
    labels.map((value) => [value, 0]),
  );

  for (const value of Object.values(votes)) {
    if (labels.includes(value)) {
      votesByValue[value] = (votesByValue[value] ?? 0) + 1;
    }
  }

  const accumulatedVotes = Object.entries(votesByValue) as [CardValue, number][];

  accumulatedVotes.sort(([value1], [value2]) => compareCardValues(value1, value2));

  const datasets: ChartDataset<'bar', number[]>[] = [
    {
      data: accumulatedVotes.map(([, numberOfVotes]) => numberOfVotes),
      backgroundColor: [getComputedStyle(document.body).getPropertyValue('--primary')],
      borderColor: getComputedStyle(document.body).getPropertyValue('--background'),
    },
  ];

  return {
    labels,
    datasets,
  };
};
