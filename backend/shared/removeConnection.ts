import { deleteConnection } from './database/deleteConnection';
import { getConnection } from './database/getConnection';
import { removeConnectionsFromGroup } from './database/removeConnectionsFromGroup';
import { Config } from './types';

export const removeConnection = async (config: Config): Promise<unknown> => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId, userId } = connectionItem;
  return Promise.all([
    deleteConnection(config),
    userId && groupId && removeConnectionsFromGroup(groupId, [userId], config),
  ]);
};
