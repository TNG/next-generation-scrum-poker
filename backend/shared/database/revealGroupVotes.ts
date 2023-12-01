import { Config, GroupItem } from '../types';

export const revealGroupVotes = async (
  groupId: string,
  { tableName, aws }: Config,
): Promise<GroupItem> =>
  (
    await aws.DynamoDB.UpdateItem({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'SET visible = :visibility',
      ExpressionAttributeValues: {
        ':visibility': true,
      },
      ReturnValues: 'ALL_NEW',
    })
  ).Attributes as unknown as GroupItem;
