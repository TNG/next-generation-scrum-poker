import { Config, ConnectionItem, GroupItem } from './types';

const { validUserId } = require('./filter-userId.js');
const { getConnectionItem, getGroupItem } = require('./get-item.js');
const { broadcastState } = require('./broadcast-state.js');

export function getResetVotesUpdateParams(
  groupItem: GroupItem,
  tableName: string,
  connectionItem: ConnectionItem
) {
  const userIds = Object.keys(groupItem)
    .filter(validUserId)
    .filter((userId) => groupItem[userId].vote !== 'observer');
  const removeUserVotes = userIds.map((id, idx) => `#${idx}.vote`).join(',');

  const expressionAttributeNames = userIds.reduce(
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
    UpdateExpression: removeUserVotes ? `REMOVE visible, ${removeUserVotes}` : 'REMOVE visible',
    ExpressionAttributeNames: removeUserVotes ? expressionAttributeNames : undefined,
  };
}

export async function resetVotes(config: Config) {
  const { connectionId, tableName, ddb } = config;
  const connectionItem = await getConnectionItem(connectionId, tableName, ddb);
  const groupItem = await getGroupItem(connectionItem.groupId, tableName, ddb);
  const updateParams = getResetVotesUpdateParams(groupItem, tableName, connectionItem);
  await ddb.update(updateParams).promise();
  await Promise.all(await broadcastState(connectionItem.groupId, config));
}
