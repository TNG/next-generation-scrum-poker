import { Config } from '../types';

export const removeGroupFromConnection = ({ aws, tableName, connectionId }: Config) =>
  aws.DynamoDB.UpdateItem({
    TableName: tableName,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
    UpdateExpression: `REMOVE userId, groupId`,
  });
