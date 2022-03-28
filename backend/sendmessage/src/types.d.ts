import * as AWS from 'aws-sdk';
import { PostToConnectionRequest } from 'aws-sdk/clients/apigatewaymanagementapi';
import { CardValue } from './shared/WebSocketMessages';

export interface Config {
  connectionId: string;
  tableName: string;
  ddb: AWS.DynamoDB.DocumentClient;
  handler: {
    postToConnection: (arg: PostToConnectionRequest) => { promise(): Promise<unknown> };
  };
}

export interface GroupItem {
  scale: Array<CardValue>;
  ttl: number;
  groupId: string;
  primaryKey: `groupId:${string}`;
  visible: boolean;
  connections: {
    [id: string]: {
      connectionId: string;
      vote: CardValue;
    };
  };
}

export interface ConnectionItem {
  groupId: string;
  userId: string;
}
