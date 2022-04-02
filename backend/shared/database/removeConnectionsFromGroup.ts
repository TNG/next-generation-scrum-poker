import { Config } from '../types';

export const removeConnectionsFromGroup = (
  groupId: string,
  removedUserIds: string[],
  { ddb, tableName }: Config
) => {
  const userIdAttributeNames = Object.fromEntries(
    removedUserIds.map((userId, index) => [`#${index}`, userId])
  );
  return ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `REMOVE ${Object.keys(userIdAttributeNames)
        .map((attributeName) => `connections.${attributeName}`)
        .join(',')}`,
      ExpressionAttributeNames: userIdAttributeNames,
    })
    .promise();
};
