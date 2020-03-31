async function sendMessageToConnection(message, config) {
  try {
    await config.apigwManagementApi
      .postToConnection({ ConnectionId: config.connectionId, Data: message })
      .promise();
  } catch (e) {
    if (e.statusCode === 410) {
      console.log(`Found stale connection, deleting ${config.connectionId}`);
      await config.ddb
        .delete({
          TableName: config.tableName,
          Key: { primaryKey: `connectionId:${config.connectionId}` },
        })
        .promise();
    } else {
      throw e;
    }
  }
}

module.exports = {
  sendMessageToConnection,
};
