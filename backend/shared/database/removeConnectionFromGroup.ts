import { Config, GroupItem } from '../types';

export const removeConnectionFromGroup = async (
  userId: string,
  groupId: string,
  { tableName, aws }: Config,
): Promise<GroupItem> =>
  (
    await aws.DynamoDB.UpdateItem({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'REMOVE connections.#1.connectionId',
      ExpressionAttributeNames: {
        '#1': userId,
      },
      ReturnValues: 'ALL_NEW',
    })
  ).Attributes as unknown as GroupItem;
