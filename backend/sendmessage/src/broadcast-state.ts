import { Votes } from '../../../shared/serverMessages';
import { ConfigWithHandler, GroupItem } from '../../shared/types';
import { sendMessageToConnection } from './send-message-to-connection';

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
