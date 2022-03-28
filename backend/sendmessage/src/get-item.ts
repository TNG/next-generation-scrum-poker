import * as AWS from 'aws-sdk';
import { Config, ConnectionItem, GroupItem } from './types';

async function getItem<T>(
  itemKey: string,
  itemId: string,
  tableName: string,
  ddb: AWS.DynamoDB.DocumentClient
): Promise<T> {
  const queryItem = {
    TableName: tableName,
    ConsistentRead: true,
    Key: {
      primaryKey: `${itemKey}:${itemId}`,
    },
  };
  return (await ddb.get(queryItem).promise()).Item as T;
}

export const getGroupItem = async (
  groupId: string,
  { tableName, ddb }: Config
): Promise<GroupItem | null> => {
  const item = await getItem<GroupItem>('groupId', groupId, tableName, ddb);
  console.log('getGroupItem', item);
  if (!item) return null;
  if (!item.connections) {
    // This is an old, pre-migration group where connections are top-level. We need to transform it.
    // This can be removed once we are sure no old items exist
    item.connections = Object.fromEntries(Object.entries(item).filter(isValidUserEntry));
  }
  return item;
};

const isValidUserEntry = ([userId]: string[]) => {
  return (
    userId &&
    userId !== 'primaryKey' &&
    userId !== 'visible' &&
    userId !== 'groupId' &&
    userId !== 'scale' &&
    userId !== 'ttl'
  );
};

// TODO Lukas is it possible that an item cannot be found here? How to handle?
export const getConnectionItem = ({
  connectionId,
  tableName,
  ddb,
}: Config): Promise<ConnectionItem> => getItem('connectionId', connectionId, tableName, ddb);
