import { CardValue } from './shared/WebSocketMessages';

export interface GroupItem {
  scale: Array<CardValue>;
  ttl: number;
  groupId: string;
  primaryKey: `groupId:${string}`;
  visible: boolean;
  connections: {
    [id: string]: {
      connectionId: string;
      vote: CardValue;
    };
  };
}

export interface ConnectionItem {
  groupId?: string;
  userId?: string;
}
