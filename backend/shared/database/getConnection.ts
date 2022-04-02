import { Config, ConnectionItem } from '../types';
import { getItem } from './getItem';

export const getConnection = ({
  connectionId,
  tableName,
  ddb,
}: Config): Promise<ConnectionItem | void> => getItem('connectionId', connectionId, tableName, ddb);
