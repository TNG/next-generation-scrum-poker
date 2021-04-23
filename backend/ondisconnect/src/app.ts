import * as AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';
import { disconnect } from './disconnect';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandler = async (event) => {
  return await disconnect(ddb, event.requestContext.connectionId);
};
