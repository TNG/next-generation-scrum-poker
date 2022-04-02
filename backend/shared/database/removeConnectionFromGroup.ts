import { Config } from '../types';

export const removeConnectionFromGroup = (
  userId: string,
  groupId: string,
  { tableName, ddb }: Config
) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'REMOVE connections.#1.connectionId',
      ExpressionAttributeNames: {
        '#1': userId,
      },
    })
    .promise();
