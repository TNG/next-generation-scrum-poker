import { broadcastState } from './broadcast-state';
import { VOTE_NOTE_VOTED } from './shared/cards';
import { Config, ConfigWithHandler } from './sharedBackend/config';
import { getConnectionItem } from './sharedBackend/getConnectionItem';
import { getGroupItem, GroupConnections } from './sharedBackend/getGroupItem';

export const resetVotes = async (config: ConfigWithHandler) => {
  const connectionItem = await getConnectionItem(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;
  await resetPersistedVotes(groupId, groupItem.connections, false, config);
  await broadcastState(groupId, config);
};

export const resetPersistedVotes = (
  groupId: string,
  connections: GroupConnections,
  updateScale: string[] | false,
  { tableName, ddb }: Config
): Promise<unknown> => {
  const userIds = Object.keys(connections).filter(
    (userId) => connections[userId].vote !== 'observer'
  );
  const userIdAttributeNames = Object.fromEntries(
    userIds.map((userId, index) => [`#${index}`, userId])
  );
  const updates = [
    'visible = :visible',
    ...(updateScale ? ['scale = :scale'] : []),
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
        ...(updateScale ? { ':scale': updateScale } : {}),
      },
      ExpressionAttributeNames: userIdAttributeNames,
    })
    .promise();
};
