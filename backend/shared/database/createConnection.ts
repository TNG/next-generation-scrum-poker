import { Config } from '../types';

export const createConnection = async (ttl: number, { aws, connectionId, tableName }: Config) =>
  aws.DynamoDB.PutItem({
    TableName: tableName,
    Item: {
      primaryKey: `connectionId:${connectionId}`,
      connectionId,
      ttl,
    },
  });
