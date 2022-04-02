import { CardValue } from '../../../shared/cards';
import { Config, GroupItem } from '../types';

export const setGroupConnectionVote = async (
  groupId: string,
  userId: string,
  vote: CardValue,
  { ddb, tableName }: Config
): Promise<GroupItem> =>
  (
    await ddb
      .update({
        TableName: tableName,
        Key: {
          primaryKey: `groupId:${groupId}`,
        },
        UpdateExpression: `SET connections.#userId.vote = :vote`,
        ExpressionAttributeNames: {
          '#userId': userId,
        },
        ExpressionAttributeValues: {
          ':vote': vote,
        },
      })
      .promise()
  ).Attributes as GroupItem;
