import { Config, ConnectionItem, GroupItem } from './types';

const { validUserId } = require('./filter-userId');
const { getConnectionItem, getGroupItem } = require('./get-item');
const { broadcastState } = require('./broadcast-state');
const { sendMessageToConnection } = require('./send-message-to-connection');

function getRemoveUsersFromGroupParams(
  userIdsNotVoted: string[],
  tableName: string,
  connectionItem: ConnectionItem
) {
  const removeUsers = userIdsNotVoted.map((id, idx) => `#${idx}`).join(',');
  const expressionAttributeNames = userIdsNotVoted.reduce(
    (attributeNames, currentId, currentIdx) => ({
      ...attributeNames,
      [`#${currentIdx}`]: currentId,
    }),
    {}
  );
  return {
    TableName: tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: `REMOVE ${removeUsers}`,
    ExpressionAttributeNames: expressionAttributeNames,
  };
}

function getRemoveGroupFromConnectionParams(tableName: string, groupItem: GroupItem, id: string) {
  return {
    TableName: tableName,
    Key: {
      primaryKey: `connectionId:${groupItem[id].connectionId}`,
    },
    UpdateExpression: `REMOVE userId, groupId`,
  };
}

export async function removeUsersNotVoted(config: Config) {
  const { connectionId, tableName, ddb } = config;
  const dbUpdates = [];
  const connectionItem = await getConnectionItem(connectionId, tableName, ddb);
  const groupItem = await getGroupItem(connectionItem.groupId, tableName, ddb);
  const userIdsNotVoted = Object.keys(groupItem)
    .filter(validUserId)
    .filter((id) => !groupItem[id].vote);

  if (userIdsNotVoted) {
    dbUpdates.push(
      userIdsNotVoted.map((id) =>
        ddb.update(getRemoveGroupFromConnectionParams(tableName, groupItem, id)).promise()
      )
    );

    const updateParams = getRemoveUsersFromGroupParams(userIdsNotVoted, tableName, connectionItem);
    dbUpdates.push(ddb.update(updateParams).promise());
  }

  await Promise.all(dbUpdates as any);
  await Promise.all(await broadcastState(connectionItem.groupId, config));
  await Promise.all(
    userIdsNotVoted.map((id) =>
      sendMessageToConnection(
        JSON.stringify({ type: 'not-logged-in' }),
        (config = { ...config, connectionId: groupItem[id].connectionId })
      )
    )
  );
}
