import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import { captureException } from '../../shared/exceptions';
import { TABLE_NAME } from './const';
import { onDisconnect } from './on-disconnect';

const ddb = DynamoDBDocument.from(
  new DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION,
  }),
);

export const handler: APIGatewayProxyHandler = ({
  requestContext: { connectionId, domainName },
}) => {
  if (!connectionId) {
    return captureException(new Error('Unexpected disconnect without connectionId.'));
  }
  return onDisconnect({
    ddb,
    connectionId,
    tableName: TABLE_NAME,
    handler: new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: `https://${domainName}`,
    }),
  });
};
