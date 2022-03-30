import { CardValue, VOTE_NOTE_VOTED } from '../shared/cards';
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

export const getGroupItem = async (groupId: string, config: Config): Promise<GroupItem | null> => {
  const item = await getItem<GroupItem>('groupId', groupId, config.tableName, config.ddb);
  if (!item) return null;
  if (!item.connections) {
    // This is an old, pre-migration group where connections are top-level. We need to transform it.
    // This can be removed once we are sure no old items exist
    item.connections = Object.fromEntries(Object.entries(item).filter(isValidUserEntry));
    for (const connection of Object.values(item.connections)) {
      connection.vote = connection.vote || VOTE_NOTE_VOTED;
    }
    await addConnectionsToGroup(groupId, item.connections, config);
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

const addConnectionsToGroup = (
  groupId: string,
  connections: GroupConnections,
  { ddb, tableName }: Config
) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `SET connections = :connections`,
      ExpressionAttributeValues: {
        ':connections': connections,
      },
    })
    .promise();
