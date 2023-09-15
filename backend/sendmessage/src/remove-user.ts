import { broadcastState, sendMessageToConnection } from '../../shared/actions';
import { getConnection } from '../../shared/database/getConnection';
import { getGroup } from '../../shared/database/getGroup';
import { removeConnectionsFromGroup } from '../../shared/database/removeConnectionsFromGroup';
import { removeGroupFromConnection } from '../../shared/database/removeGroupFromConnection';
import { ConfigWithHandler } from '../../shared/types';

export const removeUser = async (user: string, config: ConfigWithHandler): Promise<void> => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId, userId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroup(groupId, config);
  if (!groupItem) return;
  const { connections } = groupItem;
  if (user in connections) {
    const userConnectionId = connections[user].connectionId;
    const [updatedGroupItem] = await Promise.all([
      removeConnectionsFromGroup(groupId, [user], config),
      userConnectionId &&
        removeGroupFromConnection({
          ...config,
          connectionId: userConnectionId,
        }),
    ]);
    await Promise.all([
      broadcastState(updatedGroupItem, config),
      userConnectionId &&
        sendMessageToConnection(
          { type: 'not-logged-in', payload: { reason: `You have been removed by ${userId}.` } },
          { ...config, connectionId: userConnectionId }
        ),
    ]);
  }
};
