import { CardValue, WebsocketMessage } from '../types/WebSocket';

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
      vote: vote,
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

const buildRequest = (data: WebsocketMessage) => JSON.stringify({ message: 'sendmessage', data });
