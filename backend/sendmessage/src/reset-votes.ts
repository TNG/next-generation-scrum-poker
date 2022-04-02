import { getConnection } from '../../shared/database/getConnection';
import { getGroup } from '../../shared/database/getGroup';
import { resetGroupVotes } from '../../shared/database/resetGroupVotes';
import { ConfigWithHandler } from '../../shared/types';
import { broadcastState } from './broadcast-state';

export const resetVotes = async (config: ConfigWithHandler) => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroup(groupId, config);
  if (!groupItem) return;
  await resetGroupVotes(groupId, groupItem.connections, false, config);
  await broadcastState(groupId, config);
};
