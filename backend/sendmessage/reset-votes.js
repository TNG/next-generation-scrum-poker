const { validUserId } = require('./filter-userId');
const { getConnectionItem, getGroupItem } = require('./get-item');

async function resetVotes(connectionId, tableName, ddb) {
  const connectionItem = await getConnectionItem(connectionId, tableName, ddb);
  const groupItem = await getGroupItem(connectionItem.groupId, tableName, ddb);
  const userIdsToResetVotes = Object.keys(groupItem)
    .filter(validUserId)
    .filter((id) => !!groupItem[id].vote);
  const removeUserVotes = userIdsToResetVotes.map((id) => `${id}.vote`).join(',');

  const updateParams = {
    TableName: tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: removeUserVotes ? `REMOVE visible, ${removeUserVotes}` : 'REMOVE visible',
  };

  return ddb.update(updateParams).promise();
}

module.exports = {
  resetVotes,
};
