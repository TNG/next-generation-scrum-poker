import * as AWS from 'aws-sdk';
import { PostToConnectionRequest } from 'aws-sdk/clients/apigatewaymanagementapi';

export interface Config {
  connectionId?: string;
  tableName: string;
  ddb: AWS.DynamoDB.DocumentClient;
  handler: {
    postToConnection: (arg: PostToConnectionRequest) => { promise(): Promise<unknown> };
  };
}

export interface GroupItem {
  [id: string]: {
    connectionId?: string;
    vote?: string;
  };
}

export interface ConnectionItem {
  groupId?: string;
}

export interface Payload {
  user?: string;
  session?: string;
  scale?: string;
  vote?: string;
}

export interface Message {
  type: string;
  payload?: Payload;
}
