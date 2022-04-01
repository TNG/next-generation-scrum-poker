import { CardValue } from '../../shared/cards';
import { Config } from './config';
import { getItem } from './item';

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

export const getGroupItem = async (groupId: string, config: Config): Promise<GroupItem | void> =>
  getItem<GroupItem>('groupId', groupId, config.tableName, config.ddb);
