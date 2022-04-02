import { CardValue } from './cards';

interface LoginMessage {
  type: 'login';
  payload: {
    user: string;
    session: string;
  };
}

interface SetVoteMessage {
  type: 'set-vote';
  payload: {
    vote: CardValue;
  };
}

interface SetScaleMessage {
  type: 'set-scale';
  payload: {
    scale: Array<CardValue>;
  };
}

interface RevealVotesMessage {
  type: 'reveal-votes';
}

interface ResetVotesMessage {
  type: 'reset-votes';
}

interface RemoveUsersNotVotedMessage {
  type: 'remove-users-not-voted';
}

export type ClientMessage =
  | LoginMessage
  | SetVoteMessage
  | SetScaleMessage
  | RevealVotesMessage
  | ResetVotesMessage
  | RemoveUsersNotVotedMessage;
