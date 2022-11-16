import { VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { getPieChartVoteData } from './getPieChartVoteData';

describe('The getPieChartVoteData function', () => {
  it('accumulates votes correctly', () => {
    const { datasets, labels } = getPieChartVoteData({
      user1: '2',
      user2: '2',
      user3: '1',
      user4: '2',
      user5: '1',
      user6: '0.5',
    });
    expect(datasets[0].data).toEqual([1, 2, 3]);
    expect(labels).toEqual(['0.5', '1', '2']);
  });

  it.each([VOTE_COFFEE, VOTE_OBSERVER, VOTE_NOTE_VOTED] as const)('ignores %p votes', (vote) => {
    const { datasets, labels } = getPieChartVoteData({
      user1: '1',
      user2: vote,
    });
    expect(datasets[0].data).toEqual([1]);
    expect(labels).toEqual(['1']);
  });
});
