const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

exports.handler = async (event) => {
  const expiryDate = new Date(Date.now());
  expiryDate.setHours(expiryDate.getHours() + parseFloat(process.env.EXPIRY_TIME_IN_HOUR));
  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      primaryKey: `connectionId:${event.requestContext.connectionId}`,
      connectionId: event.requestContext.connectionId,
      ttl: Math.floor(expiryDate / 1000),
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
