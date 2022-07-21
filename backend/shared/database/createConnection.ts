import { Config } from '../types';

export const createConnection = async (ttl: number, { ddb, connectionId, tableName }: Config) =>
  ddb
    .put({
      TableName: tableName,
      Item: {
        primaryKey: `connectionId:${connectionId}`,
        connectionId,
        ttl,
      },
    })
    .promise();
