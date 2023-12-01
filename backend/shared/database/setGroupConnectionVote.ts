import { CardValue } from '../../../shared/cards';
import { Config, GroupItem } from '../types';

export const setGroupConnectionVote = async (
  groupId: string,
  userId: string,
  vote: CardValue,
  { aws, tableName }: Config,
): Promise<GroupItem> =>
  (
    await aws.DynamoDB.UpdateItem({
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
      ReturnValues: 'ALL_NEW',
    })
  ).Attributes as unknown as GroupItem;
