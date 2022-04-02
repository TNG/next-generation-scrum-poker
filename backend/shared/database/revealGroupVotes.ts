import { Config } from '../types';

export const revealGroupVotes = (groupId: string, { tableName, ddb }: Config): Promise<unknown> => {
  return ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'SET visible = :visibility',
      ExpressionAttributeValues: {
        ':visibility': true,
      },
    })
    .promise();
};
