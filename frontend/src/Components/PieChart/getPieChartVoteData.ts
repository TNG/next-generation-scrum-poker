import { ChartDataset } from 'chart.js';
import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { Votes } from '../../../../shared/serverMessages';
import { compareCardValues } from '../ResultsPage/compareVotes';

export const getPieChartVoteData = (
  votes: Votes
): { labels: CardValue[]; datasets: ChartDataset<'pie', number[]>[] } => {
  const votesByValue: Partial<Record<CardValue, number>> = {};
  for (const value of Object.values(votes)) {
    if (![VOTE_OBSERVER, VOTE_NOTE_VOTED, VOTE_COFFEE].includes(value)) {
      votesByValue[value] = (votesByValue[value] ?? 0) + 1;
    }
  }

  const accumulatedVotes = Object.entries(votesByValue) as [CardValue, number][];

  accumulatedVotes.sort(([value1], [value2]) => compareCardValues(value1, value2));

  const datasets: ChartDataset<'pie', number[]>[] = [
    {
      data: accumulatedVotes.map(([, numberOfVotes]) => numberOfVotes),
      backgroundColor: [
        // Colors taken from https://colorbrewer2.org/
        '#a6cee3',
        '#1f78b4',
        '#b2df8a',
        '#33a02c',
        '#fb9a99',
        '#e31a1c',
        '#fdbf6f',
        '#ff7f00',
        '#cab2d6',
        '#6a3d9a',
        '#ffff99',
        '#b15928',
      ],
      hoverOffset: 4,
      borderColor: getComputedStyle(document.body).getPropertyValue('--background'),
    },
  ];

  return {
    labels: accumulatedVotes.map(([label]) => label),
    datasets,
  };
};
