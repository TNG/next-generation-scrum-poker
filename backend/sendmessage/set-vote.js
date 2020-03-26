function setVote(vote, connectionId, tableName, ddb) {
    if (!vote) {
        throw new SyntaxError('Vote must be not empty.')
    }

    const updateParams = {
        TableName: tableName,
        Key: {
            "connectionId": connectionId,
        },
        UpdateExpression: "SET vote = :vote",
        ExpressionAttributeValues: {
            ":vote": vote,
        },
        ReturnValues: "UPDATED_NEW"
    };

    return ddb.update(updateParams).promise();
}

module.exports = {
    setVote
};