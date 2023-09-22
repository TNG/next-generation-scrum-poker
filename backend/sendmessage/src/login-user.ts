import { VOTE_NOTE_VOTED } from '../../../shared/cards';
import { broadcastState, sendMessageToConnection } from '../../shared/actions';
import { addConnectionToGroup } from '../../shared/database/addConnectionToGroup';
import { addUserAndGroupToConnection } from '../../shared/database/addUserAndGroupToConnection';
import { createGroupWithConnection } from '../../shared/database/createGroupWithConnection';
import { getGroup } from '../../shared/database/getGroup';
import { getTtl } from '../../shared/getTtl';
import { ConfigWithHandler } from '../../shared/types';
import { EXPIRY_TIME_IN_HOUR } from './const';

export const loginUser = async (userId: string, groupId: string, config: ConfigWithHandler) => {
  const groupItem = await getGroup(groupId, config);
  const groupUpdate = groupItem
    ? addConnectionToGroup(
        groupId,
        userId,
        groupItem.connections[userId]?.vote || VOTE_NOTE_VOTED,
        config,
      )
    : createGroupWithConnection(groupId, userId, getTtl(EXPIRY_TIME_IN_HOUR), config);

  const userConnectionId = groupItem?.connections[userId]?.connectionId;
  // While it should not be possible to log in while there already is a connection,
  // this addresses some edge cases observed during local development and makes
  // it possible to login more liberally.
  if (userConnectionId && userConnectionId !== config.connectionId) {
    await sendMessageToConnection(
      {
        type: 'not-logged-in',
        payload: { reason: 'Your session was taken over by another user with the same name.' },
      },
      { ...config, connectionId: userConnectionId },
    );
  }

  const [updatedGroupItem] = await Promise.all([
    groupUpdate,
    addUserAndGroupToConnection(groupId, userId, config),
  ]);
  await broadcastState(updatedGroupItem, config);
};
