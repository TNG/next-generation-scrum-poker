const { getConnectionItem } = require('./get-item.js');
const { broadcastState } = require('./broadcast-state.js');

async function revealVotes(config) {
  const connectionItem = await getConnectionItem(config.connectionId, config.tableName, config.ddb);
  const updateParams = {
    TableName: config.tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: 'SET visible = :visibility',
    ExpressionAttributeValues: {
      ':visibility': true,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await config.ddb.update(updateParams).promise();
  await Promise.all(await broadcastState(connectionItem.groupId, config));
}

module.exports = {
  revealVotes,
};
