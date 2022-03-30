import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import * as AWS from 'aws-sdk';
import { TABLE_NAME } from './const';
import { onDisconnect } from './on-disconnect';
import { captureException } from './sharedBackend/exceptions';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = ({ requestContext: { connectionId } }) => {
  if (!connectionId) {
    return captureException(new Error('Unexpected disconnect without connectionId.'));
  }
  return onDisconnect({ ddb, connectionId, tableName: TABLE_NAME });
};
