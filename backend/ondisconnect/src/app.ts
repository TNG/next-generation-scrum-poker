import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

const TABLE_NAME = process.env.TABLE_NAME || 'scrum_poker';

export const handler: APIGatewayProxyHandler = async (event) => {
  const deleteParams = {
    TableName: TABLE_NAME,
    Key: {
      primaryKey: `connectionId:${event.requestContext.connectionId}`,
    },
  };
  const queryItemParams = {
    TableName: TABLE_NAME,
    ConsistentRead: true,
    Key: {
      primaryKey: `connectionId:${event.requestContext.connectionId}`,
    },
  };

  try {
    const connectionItem = (await ddb.get(queryItemParams).promise()).Item;
    await ddb.delete(deleteParams).promise();
    if (connectionItem && connectionItem.groupId) {
      const updateParams = {
        TableName: TABLE_NAME,
        Key: {
          primaryKey: `groupId:${connectionItem.groupId}`,
        },
        UpdateExpression: 'REMOVE #1.connectionId',
        ExpressionAttributeNames: {
          '#1': connectionItem.userId,
        },
      };
      await ddb.update(updateParams).promise();
    }
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
