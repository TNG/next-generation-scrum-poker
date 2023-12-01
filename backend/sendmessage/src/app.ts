import awsLite from '@aws-lite/client';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { captureException } from '../../shared/exceptions';
import { TABLE_NAME } from './const';
import { onMessage } from './on-message';

export const handler: APIGatewayProxyHandler = ({ requestContext: { connectionId }, body }) => {
  if (!connectionId || !body) {
    return captureException(new Error('Unexpected request without body or connectionId.'));
  }
  const message = JSON.parse(body).data;
  return awsLite({
    region: process.env.AWS_REGION,
  }).then((aws) =>
    onMessage(message, {
      connectionId,
      tableName: TABLE_NAME,
      aws,
      handler: aws.ApiGatewayManagementApi,
    }),
  );
};
