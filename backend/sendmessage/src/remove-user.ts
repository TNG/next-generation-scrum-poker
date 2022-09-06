import { getConnection } from '../../shared/database/getConnection';
import { getGroup } from '../../shared/database/getGroup';
import { removeConnectionsFromGroup } from '../../shared/database/removeConnectionsFromGroup';
import { removeGroupFromConnection } from '../../shared/database/removeGroupFromConnection';
import { ConfigWithHandler } from '../../shared/types';
import { broadcastState } from './broadcast-state';
import { sendMessageToConnection } from './send-message-to-connection';

export const removeUser = async (user: string, config: ConfigWithHandler): Promise<void> => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroup(groupId, config);
  if (!groupItem) return;
  const { connections } = groupItem;
  if (user in connections) {
    const [updatedGroupItem] = await Promise.all([
      removeConnectionsFromGroup(groupId, [user], config),
      removeGroupFromConnection({
        ...config,
        connectionId: connections[user].connectionId,
      }),
    ]);
    await Promise.all([
      broadcastState(updatedGroupItem, config),
      sendMessageToConnection(
        { type: 'not-logged-in' },
        (config = { ...config, connectionId: connections[user].connectionId })
      ),
    ]);
  }
};
