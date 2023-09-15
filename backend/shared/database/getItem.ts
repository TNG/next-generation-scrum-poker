import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

export const getItem = async <T>(
  itemKey: string,
  itemId: string,
  tableName: string,
  ddb: DynamoDBDocument,
): Promise<T | undefined> =>
  (
    await ddb.get({
      TableName: tableName,
      ConsistentRead: true,
      Key: {
        primaryKey: `${itemKey}:${itemId}`,
      },
    })
  ).Item as T | undefined;
