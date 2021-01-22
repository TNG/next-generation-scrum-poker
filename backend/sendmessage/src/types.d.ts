import * as AWS from 'aws-sdk';

export interface Config {
  connectionId?: string;
  tableName: string;
  ddb: AWS.DynamoDB.DocumentClient;
  apigwManagementApi: AWS.ApiGatewayManagementApi;
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
