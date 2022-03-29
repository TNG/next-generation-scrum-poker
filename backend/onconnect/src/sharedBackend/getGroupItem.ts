import { CardValue } from '../shared/cards';
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
  primaryKey: `groupId:${string}`;
  visible: boolean;
  connections: GroupConnections;
}

export const getGroupItem = async (
  groupId: string,
  { tableName, ddb }: Config
): Promise<GroupItem | null> => {
  const item = await getItem<GroupItem>('groupId', groupId, tableName, ddb);
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
