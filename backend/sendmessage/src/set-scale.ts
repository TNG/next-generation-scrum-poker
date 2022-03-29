import { broadcastState } from './broadcast-state';
import { resetPersistedVotes } from './reset-votes';
import { CardValue } from './shared/cards';
import { ConfigWithHandler } from './sharedBackend/config';
import { getConnectionItem } from './sharedBackend/getConnectionItem';
import { getGroupItem } from './sharedBackend/getGroupItem';

export const setScale = async (scale: CardValue[], config: ConfigWithHandler): Promise<void> => {
  const connectionItem = await getConnectionItem(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;

  await resetPersistedVotes(groupId, groupItem.connections, scale, config);
  await broadcastState(groupId, config);
};
