import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApiGatewayManagementApi, DynamoDB } from 'aws-sdk';
import { TABLE_NAME } from './const';
import { onMessage } from './on-message';
import { captureException } from './sharedBackend/exceptions';

const ddb = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = ({
  requestContext: { connectionId, domainName },
  body,
}) => {
  if (!connectionId || !body) {
    return captureException(new Error('Unexpected request without body or connectionId.'));
  }
  const message = JSON.parse(body).data;
  return onMessage(message, {
    connectionId,
    tableName: TABLE_NAME,
    ddb,
    handler: new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: domainName,
    }),
  });
};
