import { Config } from '../types';

export const deleteConnection = ({ connectionId, tableName, aws }: Config) =>
  aws.DynamoDB.DeleteItem({
    TableName: tableName,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
  });
