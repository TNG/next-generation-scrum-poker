import { CardValue } from "../types/WebSocket";

export const getLoginRequest = (user: string, session: string) => JSON.stringify({
  type: "login",
  payload: {
    user,
    session
  }
});

export const getSetVoteRequest = (vote: CardValue) => JSON.stringify({
  type: 'set-vote',
  payload: {
    vote: vote
  }
});

export const getRevealVotesRequest = () => JSON.stringify({
  type: 'reveal-votes'
});

export const getResetVotesRequest = () => JSON.stringify({
  type: 'reset-votes'
});