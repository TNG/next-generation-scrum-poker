import { ServerMessage } from './shared/serverMessages';
import { ConfigWithHandler } from './sharedBackend/config';
import { removeConnection } from './sharedBackend/removeConnection';

export const sendMessageToConnection = async (
  message: ServerMessage,
  config: ConfigWithHandler
): Promise<unknown> => {
  const { handler, connectionId } = config;
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
      return removeConnection(config);
    } else {
      throw e;
    }
  }
};
