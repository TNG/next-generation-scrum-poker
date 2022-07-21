import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import { DynamoDB } from 'aws-sdk';
import { captureException } from '../../shared/exceptions';
import { TABLE_NAME } from './const';
import { onDisconnect } from './on-disconnect';

const ddb = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = ({ requestContext: { connectionId } }) => {
  if (!connectionId) {
    return captureException(new Error('Unexpected disconnect without connectionId.'));
  }
  return onDisconnect({ ddb, connectionId, tableName: TABLE_NAME });
};
