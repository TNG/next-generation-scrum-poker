import { VOTE_NOTE_VOTED } from '../../../shared/cards';
import { addConnectionToGroup } from '../../shared/database/addConnectionToGroup';
import { addUserAndGroupToConnection } from '../../shared/database/addUserAndGroupToConnection';
import { createGroupWithConnection } from '../../shared/database/createGroupWithConnection';
import { getGroup } from '../../shared/database/getGroup';
import { getTtl } from '../../shared/getTtl';
import { ConfigWithHandler } from '../../shared/types';
import { broadcastState } from './broadcast-state';
import { EXPIRY_TIME_IN_HOUR } from './const';
import { sendMessageToConnection } from './send-message-to-connection';

export const loginUser = async (userId: string, groupId: string, config: ConfigWithHandler) => {
  const groupItem = await getGroup(groupId, config);
  const groupUpdate = groupItem
    ? addConnectionToGroup(
        groupId,
        userId,
        groupItem.connections[userId]?.vote || VOTE_NOTE_VOTED,
        config
      )
    : createGroupWithConnection(groupId, userId, getTtl(EXPIRY_TIME_IN_HOUR), config);

  const userConnectionId = groupItem?.connections[userId]?.connectionId;
  if (userConnectionId) {
    await sendMessageToConnection(
      {
        type: 'not-logged-in',
        payload: { reason: 'Your session was taken over by another user with the same name.' },
      },
      { ...config, connectionId: userConnectionId }
    );
  }

  const [updatedGroupItem] = await Promise.all([
    groupUpdate,
    addUserAndGroupToConnection(groupId, userId, config),
  ]);
  await broadcastState(updatedGroupItem, config);
};
