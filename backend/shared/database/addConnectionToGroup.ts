import { CardValue } from '../../../shared/cards';
import { Config, GroupItem } from '../types';

export const addConnectionToGroup = async (
  groupId: string,
  userId: string,
  vote: CardValue,
  { ddb, tableName, connectionId }: Config
): Promise<GroupItem> =>
  (
    await ddb
      .update({
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
      .promise()
  ).Attributes as GroupItem;
