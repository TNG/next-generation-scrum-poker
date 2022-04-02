import { VOTE_NOTE_VOTED } from '../../../shared/cards';
import { SCALES } from '../../../shared/scales';
import { Config, GroupItem } from '../types';

export const createGroupWithConnection = async (
  groupId: string,
  userId: string,
  ttl: number,
  { ddb, tableName, connectionId }: Config
): Promise<GroupItem> => {
  const groupItem: GroupItem & { primaryKey: string } = {
    primaryKey: `groupId:${groupId}`,
    ttl,
    connections: {
      [userId]: { connectionId: connectionId, vote: VOTE_NOTE_VOTED },
    },
    groupId,
    scale: SCALES.COHEN_SCALE.values,
    visible: false,
  };
  await ddb
    .put({
      TableName: tableName,
      Item: groupItem,
    })
    .promise();
  return groupItem;
};
