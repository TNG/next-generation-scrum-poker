import { getGroupItem } from './get-item';
import { sendMessageToConnection } from './send-message-to-connection';
import { CardValue } from './shared/WebSocketMessages';
import { ConfigWithHandler } from './shared/backendTypes';

export async function broadcastState(groupId: string, config: ConfigWithHandler): Promise<unknown> {
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;

  const { connections, visible, scale } = groupItem;
  const userEntries = Object.entries(connections);
  const votes: { [userId: string]: CardValue } = {};
  for (const [userId, { vote }] of userEntries) {
    // This fallback is no longer needed once all pre-migration sessions have expired
    votes[userId] = vote || 'not-voted';
  }

  return Promise.all(
    userEntries.map(([, { connectionId }]) =>
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
}
