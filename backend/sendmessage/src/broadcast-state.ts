import { Votes } from '../../../shared/serverMessages';
import { ConfigWithHandler } from '../../shared/config';
import { getGroupItem } from '../../shared/getGroupItem';
import { sendMessageToConnection } from './send-message-to-connection';

export const broadcastState = async (
  groupId: string,
  config: ConfigWithHandler
): Promise<unknown> => {
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;

  const { connections, visible, scale } = groupItem;
  const connectionEntries = Object.entries(connections);
  const votes: Votes = {};
  for (const [userId, { vote }] of connectionEntries) {
    votes[userId] = vote;
  }

  return Promise.all(
    connectionEntries.map(([, { connectionId }]) =>
      sendMessageToConnection(
        {
          type: 'state',
          payload: {
            resultsVisible: visible,
            votes,
            scale,
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
