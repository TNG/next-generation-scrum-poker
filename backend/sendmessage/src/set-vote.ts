import { Config } from './types';

const { getConnectionItem } = require('./get-item');
const { broadcastState } = require('./broadcast-state');

export async function setVote(vote: string, config: Config) {
  const connectionItem = await getConnectionItem(config.connectionId, config.tableName, config.ddb);

  const updateGroupParams = {
    TableName: config.tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: 'SET #userId.vote = :vote',
    ExpressionAttributeNames: {
      '#userId': connectionItem.userId,
    },
    ExpressionAttributeValues: {
      ':vote': vote,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await config.ddb.update(updateGroupParams).promise();
  await Promise.all(await broadcastState(connectionItem.groupId, config));
}
