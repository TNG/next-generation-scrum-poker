import { Config } from '../types';

export const removeGroupFromConnection = ({ ddb, tableName, connectionId }: Config) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `connectionId:${connectionId}`,
      },
      UpdateExpression: `REMOVE userId, groupId`,
    })
    .promise();
