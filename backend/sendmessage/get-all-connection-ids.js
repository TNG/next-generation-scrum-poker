function get_query(groupId, tableName) {
    return {
        TableName: tableName,
        IndexName: "groupIdIdx",
        KeyConditionExpression: "groupId = :groupId",
        ExpressionAttributeValues: {
            ":groupId": groupId
        }
    }
}

async function getAllConnectionIds(connectionId, tableName, ddb) {
    const queryUser = {
        TableName: tableName,
        ConsistentRead: true,
        Key: {
            "connectionId": connectionId,
        }
    };
    try {
        const groupId = (await ddb.get(queryUser).promise()).Item.groupId;
        if (groupId === "X") {
             return [connectionId]
        }
        return (await ddb.query(get_query(groupId, tableName)).promise()).Items.map(item => item.connectionId);
    } catch (e) {
        return { statusCode: 500, body: e.stack }
    }
}

module.exports = {
    getAllConnectionIds
};