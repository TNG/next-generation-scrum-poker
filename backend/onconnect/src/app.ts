import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import * as AWS from 'aws-sdk';
import { TABLE_NAME } from './const';
import { onConnect } from './on-connect';
import { captureException } from './sharedBackend/exceptions';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = ({ requestContext: { connectionId } }) => {
  if (!connectionId) {
    return captureException(new Error('Unexpected connect without connectionId.'));
  }
  return onConnect({ ddb, connectionId, tableName: TABLE_NAME });
};
