import { getConnectionItem } from './get-item';
import { ServerMessage } from './shared/WebSocketMessages';
import { ConfigWithHandler } from './shared/backendTypes';

export async function sendMessageToConnection(
  message: ServerMessage,
  config: ConfigWithHandler
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
      // TODO Lukas all requests should be wrapped into methods together with the ddb and a config
      const [{ groupId, userId }] = await Promise.all([
        getConnectionItem(config),
        ddb
          .delete({
            TableName: tableName,
            Key: { primaryKey: `connectionId:${connectionId}` },
          })
          .promise(),
      ]);
      if (!(groupId && userId)) return;
      await ddb
        .update({
          TableName: tableName,
          Key: {
            primaryKey: `groupId:${groupId}`,
          },
          UpdateExpression: 'REMOVE #1.connectionId',
          ExpressionAttributeNames: {
            '#1': userId,
          },
        })
        .promise();
    } else {
      throw e;
    }
  }
}
