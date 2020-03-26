function loginUser(username, groupId, connectionId, tableName, ddb) {
    const updateParams = {
        TableName: tableName,
        Key: {
            "connectionId": connectionId
        },
        UpdateExpression: "set userId = :userId, groupId = :groupId",
        ExpressionAttributeValues: {
            ":userId": username,
            ":groupId": groupId,
        },
        ReturnValues: "UPDATED_NEW"
    };

    return ddb.update(updateParams).promise();
}

module.exports = {
    loginUser
};