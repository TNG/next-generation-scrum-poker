function resetVotes(allIds, TABLE_NAME, ddb) {
  const allUpdates = [];

  try {
    allIds.forEach((connectionId) => {
      const updateParams = {
        Key: {
          connectionId: connectionId,
        },
        TableName: TABLE_NAME,
        UpdateExpression: 'REMOVE vote, visible',
      };
      allUpdates.push(ddb.update(updateParams).promise());
    });
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return Promise.all(allUpdates);
}

module.exports = {
  resetVotes,
};
