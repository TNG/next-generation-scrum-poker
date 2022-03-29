import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { onMessage } from './on-message';
import { TABLE_NAME } from './const';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = ({
  requestContext: { connectionId, domainName },
  body,
}) => {
  if (!connectionId || !body) {
    console.log(`Unexpected request without body or connectionId.`);
    return;
  }
  const message = JSON.parse(body).data;
  return onMessage(message, {
    connectionId,
    tableName: TABLE_NAME,
    ddb,
    handler: new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: domainName,
    }),
  });
};
