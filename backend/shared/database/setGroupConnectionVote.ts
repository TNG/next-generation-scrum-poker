import { CardValue } from '../../../shared/cards';
import { Config } from '../types';

export const setGroupConnectionVote = (
  groupId: string,
  userId: string,
  vote: CardValue,
  { ddb, tableName }: Config
) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `SET connections.#userId.vote = :vote`,
      ExpressionAttributeNames: {
        '#userId': userId,
      },
      ExpressionAttributeValues: {
        ':vote': vote,
      },
    })
    .promise();
