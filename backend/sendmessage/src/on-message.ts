import { loginUser } from './login-user';
import { removeUsersNotVoted } from './remove-users-not-voted';
import { resetVotes } from './reset-votes';
import { revealVotes } from './reveal-votes';
import { setScale } from './set-scale';
import { setVote } from './set-vote';
import { ClientMessage } from './shared/clientMessages';
import { ConfigWithHandler } from './sharedBackend/config';

export const onMessage = async (message: ClientMessage, config: ConfigWithHandler) => {
  try {
    switch (message.type) {
      case 'login':
        await loginUser(message.payload.user, message.payload.session, config);
        break;
      case 'set-scale':
        await setScale(message.payload.scale, config);
        break;
      case 'reveal-votes':
        await revealVotes(config);
        break;
      case 'set-vote':
        await setVote(message.payload.vote, config);
        break;
      case 'reset-votes':
        await resetVotes(config);
        break;
      case 'remove-users-not-voted':
        await removeUsersNotVoted(config);
        break;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
