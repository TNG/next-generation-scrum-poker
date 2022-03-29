import { GroupItem } from './types';
import { getConnectionItem, getGroupItem } from './get-item';
import { sendMessageToConnection } from './send-message-to-connection';
import { broadcastState } from './broadcast-state';
import { VOTE_NOTE_VOTED } from './shared/WebSocketMessages';
import { ConfigWithHandler } from './shared/backendTypes';

// TODO Lukas make remote logout work when kicking yourself
function getRemoveUsersFromGroupParams(
  userIdsNotVoted: string[],
  tableName: string,
  groupId: string
) {
  const userIdAttributeNames = Object.fromEntries(
    userIdsNotVoted.map((userId, index) => [`#${index}`, userId])
  );
  return {
    TableName: tableName,
    Key: {
      primaryKey: `groupId:${groupId}`,
    },
    UpdateExpression: `REMOVE ${Object.keys(userIdAttributeNames)
      .map((attributeName) => `connections.${attributeName}`)
      .join(',')}`,
    ExpressionAttributeNames: userIdAttributeNames,
  };
}

function getRemoveGroupFromConnectionParams(tableName: string, groupItem: GroupItem, id: string) {
  return {
    TableName: tableName,
    Key: {
      primaryKey: `connectionId:${groupItem.connections[id].connectionId}`,
    },
    UpdateExpression: `REMOVE userId, groupId`,
  };
}

export async function removeUsersNotVoted(config: ConfigWithHandler): Promise<void> {
  const { groupId } = await getConnectionItem(config);
  if (!groupId) return;
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;
  const { connections } = groupItem;
  const userIdsNotVoted = Object.keys(connections).filter(
    (userId) => connections[userId].vote === VOTE_NOTE_VOTED
  );

  const { tableName, ddb } = config;
  // TODO Lukas batch updates into a single one
  // TODO Lukas extract db update methods
  const dbUpdates = [];
  if (userIdsNotVoted) {
    dbUpdates.push(
      userIdsNotVoted.map((id) =>
        ddb.update(getRemoveGroupFromConnectionParams(tableName, groupItem, id)).promise()
      )
    );

    dbUpdates.push(
      ddb.update(getRemoveUsersFromGroupParams(userIdsNotVoted, tableName, groupId)).promise()
    );
  }

  await Promise.all(dbUpdates);
  await Promise.all([
    broadcastState(groupId, config),
    ...userIdsNotVoted.map((id) =>
      sendMessageToConnection(
        { type: 'not-logged-in' },
        (config = { ...config, connectionId: connections[id].connectionId })
      )
    ),
  ]);
}
