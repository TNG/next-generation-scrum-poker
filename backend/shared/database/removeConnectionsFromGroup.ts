import { Config, GroupItem } from '../types';

export const removeConnectionsFromGroup = async (
  groupId: string,
  removedUserIds: string[],
  { aws, tableName }: Config,
): Promise<GroupItem> => {
  const userIdAttributeNames = Object.fromEntries(
    removedUserIds.map((userId, index) => [`#${index}`, userId]),
  );
  return (
    await aws.DynamoDB.UpdateItem({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `REMOVE ${Object.keys(userIdAttributeNames)
        .map((attributeName) => `connections.${attributeName}`)
        .join(',')}`,
      ExpressionAttributeNames: userIdAttributeNames,
      ReturnValues: 'ALL_NEW',
    })
  ).Attributes as unknown as GroupItem;
};
