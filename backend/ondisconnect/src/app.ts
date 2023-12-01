import awsLite from '@aws-lite/client';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import { captureException } from '../../shared/exceptions';
import { TABLE_NAME } from './const';
import { onDisconnect } from './on-disconnect';

export const handler: APIGatewayProxyHandler = ({
  requestContext: { connectionId, domainName },
}) => {
  if (!connectionId) {
    return captureException(new Error('Unexpected disconnect without connectionId.'));
  }
  console.log({ domainName });
  return awsLite({
    region: process.env.AWS_REGION,
  }).then((aws) =>
    onDisconnect({
      aws,
      connectionId,
      tableName: TABLE_NAME,
      handler: aws.ApiGatewayManagementApi,
    }),
  );
};
