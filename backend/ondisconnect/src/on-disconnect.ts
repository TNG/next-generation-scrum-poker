import { Config } from './shared/backendTypes';

export const onDisconnect = async ({ ddb, connectionId, tableName }: Config) => {
  try {
    // TODO Lukas this could be shared code?
    // TODO Lukas can we run requests together?
    const connectionItem = (
      await ddb
        .get({
          TableName: tableName,
          ConsistentRead: true,
          Key: {
            primaryKey: `connectionId:${connectionId}`,
          },
        })
        .promise()
    ).Item;
    await ddb
      .delete({
        TableName: tableName,
        Key: {
          primaryKey: `connectionId:${connectionId}`,
        },
      })
      .promise();
    if (connectionItem && connectionItem.groupId) {
      await ddb
        .update({
          TableName: tableName,
          Key: {
            primaryKey: `groupId:${connectionItem.groupId}`,
          },
          UpdateExpression: 'REMOVE connections.#1.connectionId',
          ExpressionAttributeNames: {
            '#1': connectionItem.userId,
          },
        })
        .promise();
    }
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
