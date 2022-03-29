import { GroupItem } from './types';
import { getConnectionItem, getGroupItem } from './get-item';
import { broadcastState } from './broadcast-state';
import { VOTE_NOTE_VOTED } from './shared/WebSocketMessages';
import { Config, ConfigWithHandler } from './shared/backendTypes';

export function persistResetVotes(
  groupItem: GroupItem,
  groupId: string,
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
        primaryKey: `groupId:${groupId}`,
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

export async function resetVotes(config: ConfigWithHandler) {
  const { groupId } = await getConnectionItem(config);
  if (!groupId) return;
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;
  await persistResetVotes(groupItem, groupId, config);
  await broadcastState(groupId, config);
}
