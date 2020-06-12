const { broadcastState } = require('./broadcast-state.js');
const { getGroupItem } = require('./get-item.js');

const COHEN_SCALE = [
  'coffee',
  '?',
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '20',
  '40',
  '100',
  '∞',
];

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
  let groupUpdate;

  if (groupItem) {
    const vote = groupItem[userId] ? groupItem[userId].vote : undefined;
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
        ':userId': { connectionId: config.connectionId, vote },
      },
      ReturnValues: 'UPDATED_NEW',
    };
    groupUpdate = config.ddb.update(updateGroupParams).promise();
  } else {
    const expiryDate = new Date(Date.now());
    expiryDate.setHours(expiryDate.getHours() + parseFloat(process.env.EXPIRY_TIME_IN_HOUR));
    const putParams = {
      TableName: config.tableName,
      Item: {
        primaryKey: `groupId:${groupId}`,
        ttl: Math.floor(expiryDate / 1000),
        [userId]: { connectionId: config.connectionId },
        groupId,
        scale: COHEN_SCALE,
      },
    };
    groupUpdate = config.ddb.put(putParams).promise();
  }
  await Promise.all([config.ddb.update(updateConnectionParams).promise(), groupUpdate]);
  await Promise.all(await broadcastState(groupId, config));
}

module.exports = {
  loginUser,
};
