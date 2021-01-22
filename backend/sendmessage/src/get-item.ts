import * as AWS from 'aws-sdk';
import { ConnectionItem, GroupItem } from './types';

async function getItem(
  itemKey: string,
  itemId: string,
  tableName: string,
  ddb: AWS.DynamoDB.DocumentClient
) {
  const queryItem = {
    TableName: tableName,
    ConsistentRead: true,
    Key: {
      primaryKey: `${itemKey}:${itemId}`,
    },
  };
  return (await ddb.get(queryItem).promise()).Item;
}

export function getGroupItem(groupId: string, tableName: string, ddb: AWS.DynamoDB.DocumentClient) {
  return getItem('groupId', groupId, tableName, ddb) as Promise<GroupItem>;
}

export function getConnectionItem(
  connectionId: string,
  tableName: string,
  ddb: AWS.DynamoDB.DocumentClient
) {
  return getItem('connectionId', connectionId, tableName, ddb) as Promise<ConnectionItem>;
}
