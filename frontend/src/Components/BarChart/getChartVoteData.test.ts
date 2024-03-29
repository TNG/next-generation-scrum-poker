import { CardValue, VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../../shared/cards';
import { getChartVoteData } from './getChartVoteData';

describe('The getChartVoteData function', () => {
  it('accumulates votes correctly', () => {
    const { data, high } = getChartVoteData({
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
    expect(data.series).toEqual([[1, 2, 3, 0, 1]]);
    expect(data.labels).toEqual(['0.5', '1', '2', '3', '4']);
    expect(high).toBe(3);
  });

  it.each<CardValue>([VOTE_COFFEE, VOTE_OBSERVER, VOTE_NOTE_VOTED])('ignores %j votes', (vote) => {
    const { data, high } = getChartVoteData({
      votes: {
        user1: '1',
        user2: vote,
        user3: '?',
      },
      scale: ['0', '0.5', '1', '2', '3'],
    });
    expect(data.series).toEqual([[1, 1]]);
    expect(data.labels).toEqual(['1', '?']);
    expect(high).toBe(1);
  });

  it('returns full scale when no valid vote was given', () => {
    const { data, high } = getChartVoteData({
      votes: {
        user1: VOTE_COFFEE,
      },
      scale: ['0', '0.5', '1', '2', '3', '4', '5'],
    });
    expect(data.series).toEqual([[]]);
    expect(data.labels).toEqual(['0', '0.5', '1', '2', '3', '4', '5']);
    expect(high).toBe(1);
  });
});
