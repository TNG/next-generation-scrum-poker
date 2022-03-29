import * as AWS from 'aws-sdk';
import { PostToConnectionRequest } from 'aws-sdk/clients/apigatewaymanagementapi';

export interface Config {
  connectionId: string;
  tableName: string;
  ddb: AWS.DynamoDB.DocumentClient;
}

export interface ConfigWithHandler extends Config {
  handler: {
    postToConnection: (arg: PostToConnectionRequest) => { promise(): Promise<unknown> };
  };
}
