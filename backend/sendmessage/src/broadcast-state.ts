import { Config } from './types';

import { validUserId } from './filter-userId';
import { getGroupItem } from './get-item';
import { sendMessageToConnection } from './send-message-to-connection';

export async function broadcastState(groupId: string, config: Config) {
  const { tableName, ddb } = config;
  let groupConnectionIds, message: string;

  if (groupId) {
    const groupItem = await getGroupItem(groupId, tableName, ddb);
    const userIds = Object.keys(groupItem).filter(validUserId);

    groupConnectionIds = userIds
      .filter((key) => groupItem[key].connectionId)
      .map((key) => groupItem[key].connectionId);
    const resultsVisible = groupItem.visible;
    const votes = userIds.reduce((accumulatedVotes, currentUserId) => {
      const vote = groupItem[currentUserId].vote;
      return {
        ...accumulatedVotes,
        [currentUserId]: vote ? vote : 'not-voted',
      };
    }, {});
    message = JSON.stringify({
      type: 'state',
      payload: { resultsVisible, votes, scale: groupItem.scale },
    });
    return groupConnectionIds.map(async (connectionId) => {
      await sendMessageToConnection(message, (config = { ...config, connectionId }));
    });
  }
}
