import { Votes } from '../../../shared/serverMessages';
import { getGroup } from '../../shared/database/getGroup';
import { ConfigWithHandler } from '../../shared/types';
import { sendMessageToConnection } from './send-message-to-connection';

export const broadcastState = async (
  groupId: string,
  config: ConfigWithHandler
): Promise<unknown> => {
  const groupItem = await getGroup(groupId, config);
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
