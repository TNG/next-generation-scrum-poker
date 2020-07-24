import { Config } from './types';

const { getConnectionItem } = require('./get-item.js');

export async function sendMessageToConnection(message: string, config: Config) {
  try {
    await config.apigwManagementApi
      .postToConnection({ ConnectionId: config.connectionId as string, Data: message })
      .promise();
  } catch (e) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${config.connectionId}`);
      const connectionItem = getConnectionItem(config.connectionId, config.tableName, config.ddb);
      await config.ddb
        .delete({
          TableName: config.tableName,
          Key: { primaryKey: `connectionId:${config.connectionId}` },
        })
        .promise();
      if (connectionItem.groupId) {
        const updateParams = {
          TableName: config.tableName,
          Key: {
            primaryKey: `groupId:${connectionItem.groupId}`,
          },
          UpdateExpression: 'REMOVE #1.connectionId',
          ExpressionAttributeNames: {
            '#1': connectionItem.userId,
          },
        };
        await config.ddb.update(updateParams).promise();
      }
    } else {
      throw e;
    }
  }
}
