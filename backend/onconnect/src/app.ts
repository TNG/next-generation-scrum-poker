import awsLite from '@aws-lite/client';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import { captureException } from '../../shared/exceptions';
import { TABLE_NAME } from './const';
import { onConnect } from './on-connect';

export const handler: APIGatewayProxyHandler = ({ requestContext: { connectionId } }) => {
  if (!connectionId) {
    return captureException(new Error('Unexpected connect without connectionId.'));
  }
  return awsLite({
    region: process.env.AWS_REGION,
  }).then((aws) => onConnect({ aws, connectionId, tableName: TABLE_NAME }));
};
