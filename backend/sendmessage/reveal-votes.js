function revealVotes(allIds, TABLE_NAME, ddb) {
  const allUpdates = [];

  try {
    allIds.forEach((connectionId) => {
      const updateParams = {
        TableName: TABLE_NAME,
        Key: {
          connectionId: connectionId,
        },
        UpdateExpression: 'SET visible = :visibility',
        ExpressionAttributeValues: {
          ':visibility': true,
        },
        ReturnValues: 'UPDATED_NEW',
      };

      allUpdates.push(ddb.update(updateParams).promise());
    });
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return Promise.all(allUpdates);
}

module.exports = {
  revealVotes,
};
