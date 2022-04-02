import { Config } from '../types';

export const deleteConnection = ({ connectionId, tableName, ddb }: Config) =>
  ddb
    .delete({
      TableName: tableName,
      Key: {
        primaryKey: `connectionId:${connectionId}`,
      },
    })
    .promise();
