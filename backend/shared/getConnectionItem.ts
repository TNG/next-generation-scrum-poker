import { Config } from './config';
import { getItem } from './item';

export interface ConnectionItem {
  groupId?: string;
  userId?: string;
}

export const getConnectionItem = ({
  connectionId,
  tableName,
  ddb,
}: Config): Promise<ConnectionItem | void> => getItem('connectionId', connectionId, tableName, ddb);
