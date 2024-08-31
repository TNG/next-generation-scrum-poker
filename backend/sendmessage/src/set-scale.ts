import { CardValue } from '../../../shared/cards';
import { broadcastState } from '../../shared/actions';
import { getConnection } from '../../shared/database/getConnection';
import { getGroup } from '../../shared/database/getGroup';
import { resetGroupVotes } from '../../shared/database/resetGroupVotes';
import { ConfigWithHandler } from '../../shared/types';

export const setScale = async (scale: CardValue[], config: ConfigWithHandler): Promise<void> => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroup(groupId, config);
  if (!groupItem) return;

  const updatedGroupItem = await resetGroupVotes(groupId, groupItem.connections, scale, config);
  await broadcastState(updatedGroupItem, config);
};
