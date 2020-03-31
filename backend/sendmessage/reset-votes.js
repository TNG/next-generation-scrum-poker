const { validUserId } = require('./filter-userId.js');
const { getConnectionItem, getGroupItem } = require('./get-item.js');

async function resetVotes(connectionId, tableName, ddb) {
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

  return ddb.update(updateParams).promise();
}

module.exports = {
  resetVotes,
};
