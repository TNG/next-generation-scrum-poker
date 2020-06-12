const { validUserId } = require('./filter-userId.js');
const { getGroupItem } = require('./get-item.js');
const { sendMessageToConnection } = require('./send-message-to-connection.js');

async function broadcastState(groupId, config) {
  const { tableName, ddb } = config;
  let groupConnectionIds, message;

  if (groupId) {
    const groupItem = await getGroupItem(groupId, tableName, ddb);
    const userIds = Object.keys(groupItem).filter(validUserId);

    groupConnectionIds = userIds
      .filter((key) => groupItem[key].connectionId)
      .map((key) => groupItem[key].connectionId);
    const resultsVisible = !!groupItem.visible;
    const votes = userIds.reduce((accumulatedVotes, currentUserId) => {
      const vote = groupItem[currentUserId].vote;
      return {
        ...accumulatedVotes,
        [currentUserId]: vote ? vote : 'not-voted',
      };
    }, {});
    message = JSON.stringify({
      type: 'state',
      payload: { resultsVisible, votes, scale: groupItem.scale },
    });
    return groupConnectionIds.map(async (connectionId) => {
      await sendMessageToConnection(message, (config = { ...config, connectionId }));
    });
  }
}

module.exports = {
  broadcastState,
};
