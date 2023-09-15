import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { getChartVoteData } from './getChartVoteData';

describe('The getChartVoteData function', () => {
  it('accumulates votes correctly', () => {
    const { datasets, labels } = getChartVoteData({
      votes: {
        user1: '2',
        user2: '2',
        user3: '1',
        user4: '2',
        user5: '1',
        user6: '0.5',
        user7: '4',
      },
      scale: ['0', '0.5', '1', '2', '3', '4', '5'],
    });
    expect(datasets[0].data).toEqual([1, 2, 3, 0, 1]);
    expect(labels).toEqual(['0.5', '1', '2', '3', '4']);
  });

  it.each<CardValue>([VOTE_COFFEE, VOTE_OBSERVER, VOTE_NOTE_VOTED])('ignores %j votes', (vote) => {
    const { datasets, labels } = getChartVoteData({
      votes: {
        user1: '1',
        user2: vote,
        user3: '?',
      },
      scale: ['0', '0.5', '1', '2', '3'],
    });
    expect(datasets[0].data).toEqual([1, 1]);
    expect(labels).toEqual(['1', '?']);
  });

  it('returns full scale when no valid vote was given', () => {
    const { datasets, labels } = getChartVoteData({
      votes: {
        user1: VOTE_COFFEE,
      },
      scale: ['0', '0.5', '1', '2', '3', '4', '5'],
    });
    expect(datasets[0].data).toEqual([]);
    expect(labels).toEqual(['0', '0.5', '1', '2', '3', '4', '5']);
  });
});
