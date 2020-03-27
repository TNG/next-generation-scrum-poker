async function setVote(vote, connectionId, tableName, ddb) {
  const queryConnection = {
    TableName: tableName,
    ConsistentRead: true,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
  };
  const connectionItem = (await ddb.get(queryConnection).promise()).Item;

  const updateGroupParams = {
    TableName: tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: 'SET #userId.vote = :vote',
    ExpressionAttributeNames: {
      '#userId': connectionItem.userId,
    },
    ExpressionAttributeValues: {
      ':vote': vote,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return ddb.update(updateGroupParams).promise();
}

module.exports = {
  setVote,
};
