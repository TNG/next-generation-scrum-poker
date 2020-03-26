async function broadcastState(groupConnectionIds, apigwManagementApi, tableName, ddb) {
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: groupConnectionIds.map(id => ({connectionId: id}))
            },
        }
    };
    const groupItems = (await ddb.batchGet(params).promise()).Responses[tableName];

    const resultsVisible = groupItems.some(item => item.visible);
    const votes = groupItems.map(item => {
        const userId = item.userId ? item.userId : item.connectionId;
        const vote = item.vote ? item.vote : "not-voted";
        return {[userId]: vote};
    });

    const message = JSON.stringify({resultsVisible, votes});

    const postCalls = groupConnectionIds.map(async (connectionId) => {
        try {
            await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: message }).promise();
        } catch (e) {
            if (e.statusCode === 410) {
                console.log(`Found stale connection, deleting ${connectionId}`);
                await ddb.delete({ TableName: tableName, Key: { connectionId } }).promise();
            } else {
                throw e;
            }
        }
    });

    return postCalls;
}

module.exports = {
    broadcastState
};