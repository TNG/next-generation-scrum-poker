import { VOTE_NOTE_VOTED } from '../../../shared/cards';
import { getConnection } from '../../shared/database/getConnection';
import { getGroup } from '../../shared/database/getGroup';
import { removeConnectionsFromGroup } from '../../shared/database/removeConnectionsFromGroup';
import { removeGroupFromConnection } from '../../shared/database/removeGroupFromConnection';
import { ConfigWithHandler } from '../../shared/types';
import { broadcastState } from './broadcast-state';
import { sendMessageToConnection } from './send-message-to-connection';

export const removeUsersNotVoted = async (config: ConfigWithHandler): Promise<void> => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroup(groupId, config);
  if (!groupItem) return;
  const { connections } = groupItem;
  const userIdsNotVoted = Object.keys(connections).filter(
    (userId) => connections[userId].vote === VOTE_NOTE_VOTED
  );

  if (userIdsNotVoted.length) {
    const [updatedGroupItem] = await Promise.all([
      removeConnectionsFromGroup(groupId, userIdsNotVoted, config),
      ...userIdsNotVoted.map((id) =>
        removeGroupFromConnection({
          ...config,
          connectionId: groupItem.connections[id].connectionId,
        })
      ),
    ]);
    await Promise.all([
      broadcastState(updatedGroupItem, config),
      ...userIdsNotVoted.map((userId) =>
        sendMessageToConnection(
          { type: 'not-logged-in' },
          (config = { ...config, connectionId: connections[userId].connectionId })
        )
      ),
    ]);
  }
};
