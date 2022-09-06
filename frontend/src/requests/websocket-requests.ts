import { CardValue } from '../../../shared/cards';
import { ClientMessage } from '../../../shared/clientMessages';

export const getLoginRequest = (user: string, session: string) =>
  buildRequest({
    type: 'login',
    payload: {
      user,
      session,
    },
  });

export const getSetVoteRequest = (vote: CardValue) =>
  buildRequest({
    type: 'set-vote',
    payload: {
      vote,
    },
  });

export const getSetScaleRequest = (scale: Array<CardValue>) =>
  buildRequest({
    type: 'set-scale',
    payload: {
      scale,
    },
  });

export const getRevealVotesRequest = () =>
  buildRequest({
    type: 'reveal-votes',
  });

export const getResetVotesRequest = () =>
  buildRequest({
    type: 'reset-votes',
  });

export const getRemoveUserRequest = (user: string) =>
  buildRequest({
    type: 'remove-user',
    payload: {
      user,
    },
  });

const buildRequest = (data: ClientMessage) => JSON.stringify({ message: 'sendmessage', data });
