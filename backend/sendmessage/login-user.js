function loginUser(userId, groupId, connectionId, tableName, ddb) {
  const updateConnectionParams = {
    TableName: tableName,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
    UpdateExpression: 'set userId = :userId, groupId = :groupId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':groupId': groupId,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  const updateGroupParams = {
    TableName: tableName,
    Key: {
      primaryKey: `groupId:${groupId}`,
    },
    UpdateExpression: 'SET #userId = :userId, groupId = :groupId',
    ExpressionAttributeNames: {
      '#userId': userId,
    },
    ExpressionAttributeValues: {
      ':userId': { connectionId: connectionId },
      ':groupId': groupId,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  return Promise.all([
    ddb.update(updateConnectionParams).promise(),
    ddb.update(updateGroupParams).promise(),
  ]);
}

module.exports = {
  loginUser,
};
