import { AWSError } from 'aws-sdk';
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
  } catch (e) {
    if (!(e instanceof Error)) {
      return;
    }
    if ((e as AWSError).statusCode === 410) {
      return removeConnection(config);
    } else {
      throw e;
    }
  }
};
