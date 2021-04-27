import { loginUser } from './login-user';
import { setScale } from './set-scale';
import { revealVotes } from './reveal-votes';
import { setVote } from './set-vote';
import { resetVotes } from './reset-votes';
import { removeUsersNotVoted } from './remove-users-not-voted';
import { Config, Message } from './types';

export const onMessage = async (message: Message, config: Config) => {
  try {
    switch (message.type) {
      case 'login':
        await loginUser(message.payload!.user!, message.payload!.session!, config);
        break;
      case 'set-scale':
        await setScale(message.payload!.scale!, config);
        break;
      case 'reveal-votes':
        await revealVotes(config);
        break;
      case 'set-vote':
        await setVote(message.payload!.vote!, config);
        break;
      case 'reset-votes':
        await resetVotes(config);
        break;
      case 'remove-users-not-voted':
        await removeUsersNotVoted(config);
        break;
    }
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
