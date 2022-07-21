import { Config } from '../types';

export const addUserAndGroupToConnection = (
  groupId: string,
  userId: string,
  { ddb, tableName, connectionId }: Config
) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `connectionId:${connectionId}`,
      },
      UpdateExpression: 'set userId = :userId, groupId = :groupId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':groupId': groupId,
      },
    })
    .promise();
