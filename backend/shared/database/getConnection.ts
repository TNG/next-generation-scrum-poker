import { Config, ConnectionItem } from '../types';
import { getItem } from './getItem';

export const getConnection = ({
  connectionId,
  tableName,
  ddb,
}: Config): Promise<ConnectionItem | undefined> => {
  const connection = getItem<ConnectionItem>('connectionId', connectionId, tableName, ddb);
  if (!connection) {
    console.error('No connection found for connectionId', connectionId);
  }
  return connection;
};
