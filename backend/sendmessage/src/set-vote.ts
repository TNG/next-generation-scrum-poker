import { CardValue } from '../../../shared/cards';
import { broadcastState } from '../../shared/actions';
import { getConnection } from '../../shared/database/getConnection';
import { setGroupConnectionVote } from '../../shared/database/setGroupConnectionVote';
import { ConfigWithHandler } from '../../shared/types';

export const setVote = async (vote: CardValue, config: ConfigWithHandler) => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId, userId } = connectionItem;
  if (!(groupId && userId)) return;

  const updatedGroupItem = await setGroupConnectionVote(groupId, userId, vote, config);
  await broadcastState(updatedGroupItem, config);
};
