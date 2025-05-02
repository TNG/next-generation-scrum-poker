import { broadcastState } from '../../shared/actions';
import { getConnection } from '../../shared/database/getConnection';
import { revealGroupVotes } from '../../shared/database/revealGroupVotes';
import { ConfigWithHandler } from '../../shared/types';

export const revealVotes = async (config: ConfigWithHandler) => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const updatedGroupItem = await revealGroupVotes(groupId, config);
  await broadcastState(updatedGroupItem, config);
};
