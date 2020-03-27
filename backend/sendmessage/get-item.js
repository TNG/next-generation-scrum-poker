async function getItem(itemKey, itemId, tableName, ddb) {
  const queryItem = {
    TableName: tableName,
    ConsistentRead: true,
    Key: {
      primaryKey: `${itemKey}:${itemId}`,
    },
  };
  return (await ddb.get(queryItem).promise()).Item;
}

function getGroupItem(groupId, tableName, ddb) {
  return getItem('groupId', groupId, tableName, ddb);
}

function getConnectionItem(connectionId, tableName, ddb) {
  return getItem('connectionId', connectionId, tableName, ddb);
}

module.exports = {
  getConnectionItem,
  getGroupItem,
};
