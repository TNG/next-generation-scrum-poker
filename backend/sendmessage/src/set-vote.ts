import { Config } from './types';
import { getConnectionItem } from './get-item';
import { broadcastState } from './broadcast-state';

export async function setVote(vote: string, config: Config) {
  const { tableName, ddb } = config;
  const { groupId, userId } = await getConnectionItem(config);

  const updateGroupParams = {
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
  };

  await ddb.update(updateGroupParams).promise();
  await broadcastState(groupId, config);
}
