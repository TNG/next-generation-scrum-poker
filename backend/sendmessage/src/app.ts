import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Config } from './types';
import { onMessage } from './on-message';
import { TABLE_NAME } from './const';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = (event) => {
  const connectionId = event.requestContext.connectionId;
  const message = JSON.parse(event.body as string).data;
  const config: Config = {
    connectionId,
    tableName: TABLE_NAME,
    ddb,
    postToConnection: new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName,
    }).postToConnection,
  };

  return onMessage(message, config);
};
