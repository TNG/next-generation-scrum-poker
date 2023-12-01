import { CardValue } from '../../../shared/cards';
import { Config, GroupItem } from '../types';

export const addConnectionToGroup = async (
  groupId: string,
  userId: string,
  vote: CardValue,
  { aws, tableName, connectionId }: Config,
): Promise<GroupItem> =>
  (
    await aws.DynamoDB.UpdateItem({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `SET connections.#userId = :connection`,
      ExpressionAttributeNames: {
        '#userId': userId,
      },
      ExpressionAttributeValues: {
        ':connection': {
          connectionId,
          vote,
        },
      },
      ReturnValues: 'ALL_NEW',
    })
  ).Attributes as unknown as GroupItem;
