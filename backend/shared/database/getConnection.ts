import { Config, ConnectionItem } from '../types';
import { getItem } from './getItem';

export const getConnection = ({
  connectionId,
  tableName,
  aws,
}: Config): Promise<ConnectionItem | undefined> => {
  const connection = getItem<ConnectionItem>('connectionId', connectionId, tableName, aws);
  if (!connection) {
    console.error('No connection found for connectionId', connectionId);
  }
  return connection;
};
