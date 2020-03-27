async function revealVotes(connectionId, tableName, ddb) {
  const queryConnection = {
    TableName: tableName,
    ConsistentRead: true,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
  };
  const connectionItem = (await ddb.get(queryConnection).promise()).Item;
  const updateParams = {
    TableName: tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: 'SET visible = :visibility',
    ExpressionAttributeValues: {
      ':visibility': true,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return ddb.update(updateParams).promise();
}

module.exports = {
  revealVotes,
};
