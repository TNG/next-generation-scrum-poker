const { broadcastState } = require('./broadcast-state.js');
const { getGroupItem } = require('./get-item.js');

async function loginUser(userId, groupId, config) {
  const updateConnectionParams = {
    TableName: config.tableName,
    Key: {
      primaryKey: `connectionId:${config.connectionId}`,
    },
    UpdateExpression: 'set userId = :userId, groupId = :groupId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':groupId': groupId,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  const groupItem = await getGroupItem(groupId, config.tableName, config.ddb);
  let updateGroupParams;

  if (groupItem && groupItem[userId] && groupItem[userId].vote) {
    updateGroupParams = {
      TableName: config.tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'SET #userId = :userId',
      ExpressionAttributeNames: {
        '#userId': userId,
      },
      ExpressionAttributeValues: {
        ':userId': { connectionId: config.connectionId, vote: groupItem[userId].vote },
      },
      ReturnValues: 'UPDATED_NEW',
    };
  } else {
    updateGroupParams = {
      TableName: config.tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'SET #userId = :userId, groupId = :groupId',
      ExpressionAttributeNames: {
        '#userId': userId,
      },
      ExpressionAttributeValues: {
        ':userId': { connectionId: config.connectionId },
        ':groupId': groupId,
      },
      ReturnValues: 'UPDATED_NEW',
    };
  }

  await Promise.all([
    config.ddb.update(updateConnectionParams).promise(),
    config.ddb.update(updateGroupParams).promise(),
  ]);
  await Promise.all(await broadcastState(groupId, config));
}

module.exports = {
  loginUser,
};
