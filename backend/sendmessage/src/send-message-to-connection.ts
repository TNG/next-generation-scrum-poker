import { AWSError } from 'aws-sdk';
import { ServerMessage } from '../../../shared/serverMessages';
import { removeConnection } from '../../shared/removeConnection';
import { ConfigWithHandler } from '../../shared/types';

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
    if (e && (e as AWSError).statusCode === 410) {
      return removeConnection(config);
    } else {
      console.error(`Unexpected error when posting message to connection ${connectionId}:`, e);
    }
  }
};
