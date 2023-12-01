import { Config } from '../types';

export const addUserAndGroupToConnection = (
  groupId: string,
  userId: string,
  { aws, tableName, connectionId }: Config,
) =>
  aws.DynamoDB.UpdateItem({
    TableName: tableName,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
    UpdateExpression: 'set userId = :userId, groupId = :groupId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':groupId': groupId,
    },
  });
