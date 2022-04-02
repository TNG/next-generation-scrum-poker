import { VOTE_NOTE_VOTED } from '../../../shared/cards';
import { Config, GroupConnections } from '../types';

export const resetGroupVotes = (
  groupId: string,
  connections: GroupConnections,
  updateScale: string[] | false,
  { tableName, ddb }: Config
): Promise<unknown> => {
  const userIds = Object.keys(connections).filter(
    (userId) => connections[userId].vote !== 'observer'
  );
  const userIdAttributeNames = Object.fromEntries(
    userIds.map((userId, index) => [`#${index}`, userId])
  );
  const updates = [
    'visible = :visible',
    ...(updateScale ? ['scale = :scale'] : []),
    ...Object.keys(userIdAttributeNames).map(
      (attributeName) => `connections.${attributeName}.vote = :notVoted`
    ),
  ];
  return ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `SET ${updates.join(',')}`,
      ExpressionAttributeValues: {
        ':visible': false,
        ':notVoted': VOTE_NOTE_VOTED,
        ...(updateScale ? { ':scale': updateScale } : {}),
      },
      ExpressionAttributeNames: userIdAttributeNames,
    })
    .promise();
};
