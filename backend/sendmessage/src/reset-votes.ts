import { Config, ConnectionItem, GroupItem } from './types';
import { getConnectionItem, getGroupItem } from './get-item';
import { broadcastState } from './broadcast-state';
import { VOTE_NOTE_VOTED } from './shared/WebSocketMessages';

export function persistResetVotes(
  groupItem: GroupItem,
  connectionItem: ConnectionItem,
  { tableName, ddb }: Config
): Promise<unknown> {
  const userIds = Object.keys(groupItem.connections).filter(
    (userId) => groupItem.connections[userId].vote !== 'observer'
  );
  const userIdAttributeNames = Object.fromEntries(
    userIds.map((userId, index) => [`#${index}`, userId])
  );
  const updates = [
    'visible = :visible',
    ...Object.keys(userIdAttributeNames).map(
      (attributeName) => `connections.${attributeName}.vote = :notVoted`
    ),
  ];
  return ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${connectionItem.groupId}`,
      },
      UpdateExpression: `SET ${updates.join(',')}`,
      ExpressionAttributeValues: {
        ':visible': false,
        ':notVoted': VOTE_NOTE_VOTED,
      },
      ExpressionAttributeNames: userIdAttributeNames,
    })
    .promise();
}

export async function resetVotes(config: Config) {
  const connectionItem = await getConnectionItem(config);
  const groupItem = await getGroupItem(connectionItem.groupId, config);
  if (!groupItem) return;
  await persistResetVotes(groupItem, connectionItem, config);
  await broadcastState(connectionItem.groupId, config);
}
