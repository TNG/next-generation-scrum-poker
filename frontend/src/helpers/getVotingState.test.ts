import { VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../shared/cards';
import { SCALES } from '../../../shared/scales';
import { UserState, getVotingState } from './getVotingState';

describe('The getVotingState function', () => {
  it('extracts state of voted and non-voted users', () => {
    const result = getVotingState({
      connected: true,
      loginData: { user: 'User 1', session: '1234' },
      state: {
        pendingConnections: [],
        resultsVisible: false,
        scale: SCALES.COHEN_SCALE.values,
        votes: {
          ['User 1']: VOTE_NOTE_VOTED,
          ['User 2']: VOTE_COFFEE,
          ['User 3']: VOTE_OBSERVER,
          ['User 4']: '100',
        },
      },
    });

    expect(result).toEqual<UserState[]>([
      {
        observer: false,
        pendingConnection: false,
        user: 'User 1',
        vote: VOTE_NOTE_VOTED,
        voted: false,
      },
      {
        observer: false,
        pendingConnection: false,
        user: 'User 2',
        vote: VOTE_COFFEE,
        voted: true,
      },
      {
        observer: true,
        pendingConnection: false,
        user: 'User 3',
        vote: VOTE_OBSERVER,
        voted: true,
      },
      {
        observer: false,
        pendingConnection: false,
        user: 'User 4',
        vote: '100',
        voted: true,
      },
    ]);
  });

  it('extracts users with pending connections', () => {
    const result = getVotingState({
      connected: false,
      loginData: { user: 'User 1', session: '1234' },
      state: {
        pendingConnections: ['User 3'],
        resultsVisible: false,
        scale: SCALES.COHEN_SCALE.values,
        votes: {
          ['User 1']: VOTE_NOTE_VOTED,
          ['User 2']: VOTE_NOTE_VOTED,
          ['User 3']: '100',
        },
      },
    });

    expect(result).toEqual<UserState[]>([
      {
        observer: false,
        pendingConnection: true,
        user: 'User 1',
        vote: VOTE_NOTE_VOTED,
        voted: false,
      },
      {
        observer: false,
        pendingConnection: false,
        user: 'User 2',
        vote: VOTE_NOTE_VOTED,
        voted: false,
      },
      {
        observer: false,
        pendingConnection: true,
        user: 'User 3',
        vote: '100',
        voted: true,
      },
    ]);
  });
});
