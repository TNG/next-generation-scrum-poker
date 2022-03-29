import { getConnectionItem } from './get-item';
import { broadcastState } from './broadcast-state';
import { ConfigWithHandler } from './shared/backendTypes';

export async function setVote(vote: string, config: ConfigWithHandler) {
  const { tableName, ddb } = config;
  const { groupId, userId } = await getConnectionItem(config);
  if (!(groupId && userId)) return;

  await ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `SET connections.#userId.vote = :vote`,
      ExpressionAttributeNames: {
        '#userId': userId,
      },
      ExpressionAttributeValues: {
        ':vote': vote,
      },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise();
  await broadcastState(groupId, config);
}
