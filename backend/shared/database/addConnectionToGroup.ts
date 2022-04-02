import { CardValue } from '../../../shared/cards';
import { Config } from '../types';

export const addConnectionToGroup = (
  groupId: string,
  userId: string,
  vote: CardValue,
  { ddb, tableName, connectionId }: Config
) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `SET connections.#userId = :connection`,
      ExpressionAttributeNames: {
        '#userId': userId,
      },
      ExpressionAttributeValues: {
        ':connection': {
          connectionId,
          vote,
        },
      },
    })
    .promise();
