import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import { onConnect } from './on-connect';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = (event) =>
  onConnect(ddb, event.requestContext.connectionId);
