const { validUserId } = require('./filter-userId.js');
const { getConnectionItem, getGroupItem } = require('./get-item.js');
const { broadcastState } = require('./broadcast-state.js');

async function resetVotes(config) {
  const { connectionId, tableName, ddb } = config;
  const connectionItem = await getConnectionItem(connectionId, tableName, ddb);
  const groupItem = await getGroupItem(connectionItem.groupId, tableName, ddb);
  const userIds = Object.keys(groupItem).filter(validUserId);
  const removeUserVotes = userIds.map((id, idx) => `#${idx}.vote`).join(',');

  const expressionAttributeNames = userIds.reduce(
    (attributeNames, currentId, currentIdx) => ({
      ...attributeNames,
      [`#${currentIdx}`]: currentId,
    }),
    {}
  );
  const updateParams = {
    TableName: tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: removeUserVotes ? `REMOVE visible, ${removeUserVotes}` : 'REMOVE visible',
    ExpressionAttributeNames: removeUserVotes ? expressionAttributeNames : undefined,
  };

  await ddb.update(updateParams).promise();
  await Promise.all(await broadcastState(connectionItem.groupId, config));
}

module.exports = {
  resetVotes,
};
