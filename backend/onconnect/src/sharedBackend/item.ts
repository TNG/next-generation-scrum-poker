import { DynamoDB } from 'aws-sdk';

export const getItem = async <T>(
  itemKey: string,
  itemId: string,
  tableName: string,
  ddb: DynamoDB.DocumentClient
): Promise<T | void> =>
  (
    await ddb
      .get({
        TableName: tableName,
        ConsistentRead: true,
        Key: {
          primaryKey: `${itemKey}:${itemId}`,
        },
      })
      .promise()
  ).Item as T | undefined;
