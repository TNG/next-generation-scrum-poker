const { getConnectionItem, getGroupItem } = require('./get-item.js');
const { broadcastState } = require('./broadcast-state.js');
const { getResetVotesUpdateParams } = require('./reset-votes');

async function setScale(scale, config) {
  const connectionItem = await getConnectionItem(config.connectionId, config.tableName, config.ddb);
  const groupItem = await getGroupItem(connectionItem.groupId, config.tableName, config.ddb);

  const updateParams = {
    TableName: config.tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: 'SET scale = :scale',
    ExpressionAttributeValues: {
      ':scale': scale,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await config.ddb.update(updateParams).promise();
  await config.ddb
    .update(getResetVotesUpdateParams(groupItem, config.tableName, connectionItem))
    .promise();
  await Promise.all(await broadcastState(connectionItem.groupId, config));
}

module.exports = {
  setScale,
};
