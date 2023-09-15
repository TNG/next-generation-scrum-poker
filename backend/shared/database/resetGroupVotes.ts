import { VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../../../shared/cards';
import { Config, GroupConnections, GroupItem } from '../types';

export const resetGroupVotes = async (
  groupId: string,
  connections: GroupConnections,
  updateScale: string[] | false,
  { tableName, ddb }: Config,
): Promise<GroupItem> => {
  const userIds = Object.keys(connections).filter(
    (userId) => connections[userId].vote !== VOTE_OBSERVER,
  );
  const userIdAttributeNames = Object.fromEntries(
    userIds.map((userId, index) => [`#${index}`, userId]),
  );
  const updates = [
    'visible = :visible',
    ...(updateScale ? ['scale = :scale'] : []),
    ...Object.keys(userIdAttributeNames).map(
      (attributeName) => `connections.${attributeName}.vote = :notVoted`,
    ),
  ];
  return (
    await ddb.update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: `SET ${updates.join(',')}`,
      ExpressionAttributeValues: {
        ':visible': false,
        ...(userIds.length ? { ':notVoted': VOTE_NOTE_VOTED } : {}),
        ...(updateScale ? { ':scale': updateScale } : {}),
      },
      ...(userIds.length ? { ExpressionAttributeNames: userIdAttributeNames } : {}),
      ReturnValues: 'ALL_NEW',
    })
  ).Attributes as GroupItem;
};
