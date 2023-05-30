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
      },
      scale: ['0', '0.5', '1', '2', '3'],
    });
    expect(datasets[0].data).toEqual([0, 1, 2, 3, 0]);
    expect(labels).toEqual(['0', '0.5', '1', '2', '3']);
  });

  it.each<CardValue>([VOTE_COFFEE, VOTE_OBSERVER, VOTE_NOTE_VOTED])('ignores %j votes', (vote) => {
    const { datasets, labels } = getChartVoteData({
      votes: {
        user1: '1',
        user2: vote,
      },
      scale: ['0', '0.5', '1', '2', '3'],
    });
    expect(datasets[0].data).toEqual([0, 0, 1, 0, 0]);
    expect(labels).toEqual(['0', '0.5', '1', '2', '3']);
  });
});
