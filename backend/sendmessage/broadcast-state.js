const { validUserId } = require('./filter-userId.js');
const { getConnectionItem, getGroupItem } = require('./get-item.js');

async function broadcastState(connectionId, apigwManagementApi, tableName, ddb) {
  let groupConnectionIds, message;
  const connectionItem = await getConnectionItem(connectionId, tableName, ddb);

  if (connectionItem.groupId) {
    const groupItem = await getGroupItem(connectionItem.groupId, tableName, ddb);
    const userIds = Object.keys(groupItem).filter(validUserId);

    groupConnectionIds = userIds.map((key) => groupItem[key].connectionId);
    const resultsVisible = !!groupItem.visible;
    const votes = userIds.reduce((accumulatedVotes, currentUserId) => {
      const vote = groupItem[currentUserId].vote;
      return {
        ...accumulatedVotes,
        [currentUserId]: vote ? vote : 'not-voted',
      };
    }, {});
    message = JSON.stringify({ type: 'state', payload: { resultsVisible, votes } });
  } else {
    groupConnectionIds = [connectionId];
    message = JSON.stringify({
      type: 'state',
      payload: { resultsVisible: false, votes: [{ [connectionId]: 'not-voted' }] },
    });
  }

  return groupConnectionIds.map(async (connectionId) => {
    try {
      await apigwManagementApi
        .postToConnection({ ConnectionId: connectionId, Data: message })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb.delete({ TableName: tableName, Key: { connectionId } }).promise();
      } else {
        throw e;
      }
    }
  });
}

module.exports = {
  broadcastState,
};
