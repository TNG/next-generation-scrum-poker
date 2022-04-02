import { DynamoDB } from 'aws-sdk';
import { PostToConnectionRequest } from 'aws-sdk/clients/apigatewaymanagementapi';
import { CardValue } from '../../shared/cards';

export interface Config {
  connectionId: string;
  tableName: string;
  ddb: DynamoDB.DocumentClient;
}

export interface ConfigWithHandler extends Config {
  handler: {
    postToConnection: (arg: PostToConnectionRequest) => { promise(): Promise<unknown> };
  };
}

export interface ConnectionItem {
  groupId?: string;
  userId?: string;
}

export interface GroupConnections {
  [id: string]: {
    connectionId: string;
    vote: CardValue;
  };
}

export interface GroupItem {
  scale: Array<CardValue>;
  ttl: number;
  groupId: string;
  visible: boolean;
  connections: GroupConnections;
}
