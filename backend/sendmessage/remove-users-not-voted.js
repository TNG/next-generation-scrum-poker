const { validUserId } = require('./filter-userId.js');
const { getConnectionItem, getGroupItem } = require('./get-item.js');

function getRemoveUsersFromGroupParams(userIdsNotVoted, tableName, connectionItem) {
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

function getRemoveGroupFromConnectionParams(tableName, groupItem, id) {
  return {
    TableName: tableName,
    Key: {
      primaryKey: `connectionId:${groupItem[id].connectionId}`,
    },
    UpdateExpression: `REMOVE userId, groupId`,
  };
}

async function removeUsersNotVoted(connectionId, tableName, ddb) {
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

  return Promise.all(dbUpdates);
}

module.exports = {
  removeUsersNotVoted,
};
