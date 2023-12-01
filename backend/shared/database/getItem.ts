import { AwsLiteClient } from '@aws-lite/client';

export const getItem = async <T>(
  itemKey: string,
  itemId: string,
  tableName: string,
  aws: AwsLiteClient,
): Promise<T | undefined> =>
  (
    await aws.DynamoDB.GetItem({
      TableName: tableName,
      ConsistentRead: true,
      Key: {
        primaryKey: `${itemKey}:${itemId}`,
      },
    })
  ).Item as T | undefined;
