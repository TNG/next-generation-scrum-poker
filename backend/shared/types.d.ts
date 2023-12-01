import { AwsLiteApiGatewayManagementApi } from '@aws-lite/apigatewaymanagementapi-types';
import { AwsLiteClient } from '@aws-lite/client';
import { CardValue } from '../../shared/cards';

export interface Config {
  connectionId: string;
  tableName: string;
  aws: AwsLiteClient;
}

export interface ConfigWithHandler extends Config {
  handler: Pick<AwsLiteApiGatewayManagementApi, 'PostToConnection'>;
}

export interface ConnectionItem {
  groupId?: string;
  userId?: string;
}

export interface GroupConnections {
  [id: string]: {
    connectionId?: string;
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

export interface AWSError extends Error {
  statusCode?: number;
  Message: string;
}
