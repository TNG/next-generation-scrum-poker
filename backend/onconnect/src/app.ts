import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import { onConnect } from './on-connect';
import { TABLE_NAME } from './const';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = ({ requestContext: { connectionId } }) => {
  if (!connectionId) {
    console.log(`Unexpected connect without connectionId.`);
    return;
  }
  return onConnect({ ddb, connectionId, tableName: TABLE_NAME });
};
