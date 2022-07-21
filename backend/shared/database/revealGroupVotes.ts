import { Config, GroupItem } from '../types';

export const revealGroupVotes = async (
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
        UpdateExpression: 'SET visible = :visibility',
        ExpressionAttributeValues: {
          ':visibility': true,
        },
      })
      .promise()
  ).Attributes as GroupItem;
