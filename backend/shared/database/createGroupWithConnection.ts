import { VOTE_NOTE_VOTED } from '../../../shared/cards';
import { SCALES } from '../../../shared/scales';
import { Config } from '../types';

export const createGroupWithConnection = (
  groupId: string,
  userId: string,
  ttl: number,
  { ddb, tableName, connectionId }: Config
) =>
  ddb
    .put({
      TableName: tableName,
      Item: {
        primaryKey: `groupId:${groupId}`,
        ttl,
        connections: {
          [userId]: { connectionId: connectionId, vote: VOTE_NOTE_VOTED },
        },
        groupId,
        scale: SCALES.COHEN_SCALE.values,
      },
    })
    .promise();
