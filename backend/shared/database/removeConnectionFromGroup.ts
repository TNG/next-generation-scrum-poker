import { Config, GroupItem } from '../types';

export const removeConnectionFromGroup = async (
  userId: string,
  groupId: string,
  { tableName, ddb }: Config
): Promise<GroupItem> =>
  (
    await ddb
      .update({
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
      .promise()
  ).Attributes as GroupItem;
