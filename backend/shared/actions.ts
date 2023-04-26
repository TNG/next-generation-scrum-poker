import { ServerMessage, Votes } from '../../shared/serverMessages';
import { deleteConnection } from './database/deleteConnection';
import { getConnection } from './database/getConnection';
import { removeConnectionFromGroup } from './database/removeConnectionFromGroup';
import { AWSError, ConfigWithHandler, GroupItem } from './types';

export const broadcastState = async (
  { connections, visible, scale }: GroupItem,
  config: ConfigWithHandler
): Promise<unknown> => {
  const connectionEntries = Object.entries(connections);
  const votes: Votes = {};
  for (const [userId, { vote }] of connectionEntries) {
    votes[userId] = vote;
  }
  const pendingConnections = connectionEntries
    .filter(([, { connectionId }]) => !connectionId)
    .map(([userId]) => userId);

  return Promise.all(
    connectionEntries.map(
      ([, { connectionId }]) =>
        connectionId &&
        sendMessageToConnection(
          {
            type: 'state',
            payload: {
              resultsVisible: visible,
              votes,
              scale,
              pendingConnections,
            },
          },
          {
            ...config,
            connectionId,
          }
        )
    )
  );
};

export const sendMessageToConnection = async (
  message: ServerMessage,
  config: ConfigWithHandler
): Promise<unknown> => {
  const { handler, connectionId } = config;
  try {
    await handler.postToConnection({
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify(message)),
    });
  } catch (e) {
    if (e && (e as AWSError).statusCode === 410) {
      return removeConnection(config);
    } else {
      // We do not rethrow the error here because that may prevent other
      // connections from receiving the message
      console.error(`Unexpected error when posting message to connection ${connectionId}:`, e);
    }
  }
};

export const removeConnection = async (config: ConfigWithHandler): Promise<unknown> => {
  const connectionItem = await getConnection(config);
  if (!connectionItem) return;

  const { groupId, userId } = connectionItem;
  const [groupItem] = await Promise.all([
    userId && groupId && removeConnectionFromGroup(userId, groupId, config),
    deleteConnection(config),
  ]);

  if (!groupItem) return;
  return broadcastState(groupItem, config);
};
