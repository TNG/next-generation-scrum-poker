import { Config } from './types';
import { getConnectionItem } from './get-item';
import { ServerMessage } from './shared/WebSocketMessages';

export async function sendMessageToConnection(
  message: ServerMessage,
  config: Config
): Promise<void> {
  const { handler, connectionId, ddb, tableName } = config;
  try {
    await handler
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(message),
      })
      .promise();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${connectionId}`);
      const connectionItem = await getConnectionItem(config);
      await ddb
        .delete({
          TableName: tableName,
          Key: { primaryKey: `connectionId:${connectionId}` },
        })
        .promise();
      if (connectionItem.groupId) {
        const updateParams = {
          TableName: tableName,
          Key: {
            primaryKey: `groupId:${connectionItem.groupId}`,
          },
          UpdateExpression: 'REMOVE #1.connectionId',
          ExpressionAttributeNames: {
            '#1': connectionItem.userId,
          },
        };
        await ddb.update(updateParams).promise();
      }
    } else {
      throw e;
    }
  }
}
