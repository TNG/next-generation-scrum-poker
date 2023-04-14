import { broadcastState } from './broadcast-state';
import { deleteConnection } from './database/deleteConnection';
import { getConnection } from './database/getConnection';
import { removeConnectionFromGroup } from './database/removeConnectionFromGroup';
import { ConfigWithHandler } from './types';

export const removeConnection = async (config: ConfigWithHandler): Promise<unknown> => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;

  const { groupId, userId } = connectionItem;
  const [groupItem] = await Promise.all([
    userId && groupId && removeConnectionFromGroup(userId, groupId, config),
    deleteConnection(config),
  ]);

  if (!groupItem) return;
  return broadcastState(groupItem, config);
};
