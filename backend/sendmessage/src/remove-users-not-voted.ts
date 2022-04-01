import { VOTE_NOTE_VOTED } from '../../../shared/cards';
import { Config, ConfigWithHandler } from '../../shared/config';
import { getConnectionItem } from '../../shared/getConnectionItem';
import { getGroupItem } from '../../shared/getGroupItem';
import { broadcastState } from './broadcast-state';
import { sendMessageToConnection } from './send-message-to-connection';

export const removeUsersNotVoted = async (config: ConfigWithHandler): Promise<void> => {
  const connectionItem = await getConnectionItem(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;
  const { connections } = groupItem;
  const userIdsNotVoted = Object.keys(connections).filter(
    (userId) => connections[userId].vote === VOTE_NOTE_VOTED
  );

  if (userIdsNotVoted.length) {
    const dbUpdates = [
      ...userIdsNotVoted.map((id) =>
        removeGroupFromConnection({
          ...config,
          connectionId: groupItem.connections[id].connectionId,
        })
      ),
      removeUsersFromGroup(groupId, userIdsNotVoted, config),
    ];
    await Promise.all(dbUpdates);
  }
  await Promise.all([
    broadcastState(groupId, config),
    ...userIdsNotVoted.map((userId) =>
      sendMessageToConnection(
        { type: 'not-logged-in' },
        (config = { ...config, connectionId: connections[userId].connectionId })
      )
    ),
  ]);
};

const removeGroupFromConnection = ({ ddb, tableName, connectionId }: Config) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `connectionId:${connectionId}`,
      },
      UpdateExpression: `REMOVE userId, groupId`,
    })
    .promise();

const removeUsersFromGroup = (
  groupId: string,
  removedUserIds: string[],
  { ddb, tableName }: Config
) => {
  const userIdAttributeNames = Object.fromEntries(
    removedUserIds.map((userId, index) => [`#${index}`, userId])
  );
  return ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `REMOVE ${Object.keys(userIdAttributeNames)
        .map((attributeName) => `connections.${attributeName}`)
        .join(',')}`,
      ExpressionAttributeNames: userIdAttributeNames,
    })
    .promise();
};
