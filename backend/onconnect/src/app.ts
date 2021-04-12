import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

const EXPIRY_TIME_IN_HOUR = process.env.EXPIRY_TIME_IN_HOUR || '1';
const TABLE_NAME = process.env.TABLE_NAME || 'scrum_poker';

export const handler: APIGatewayProxyHandler = async (event) => {
  const expiryDate = new Date(Date.now());
  expiryDate.setHours(expiryDate.getHours() + parseFloat(EXPIRY_TIME_IN_HOUR));
  const putParams = {
    TableName: TABLE_NAME,
    Item: {
      primaryKey: `connectionId:${event.requestContext.connectionId}`,
      connectionId: event.requestContext.connectionId,
      ttl: Math.floor(expiryDate.getTime() / 1000),
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
