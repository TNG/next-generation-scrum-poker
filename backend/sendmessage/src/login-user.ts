import { Config } from './types';
import { broadcastState } from './broadcast-state';
import { getGroupItem } from './get-item';
import { VOTE_NOTE_VOTED } from './shared/WebSocketMessages';

// TODO Lukas move to shared constants
const COHEN_SCALE = [
  'coffee',
  '?',
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '20',
  '40',
  '100',
  '∞',
];

const EXPIRY_TIME_IN_HOUR = process.env.EXPIRY_TIME_IN_HOUR || '16';

// TODO Lukas extract named updates
export async function loginUser(userId: string, groupId: string, config: Config) {
  const { tableName, ddb, connectionId } = config;
  const groupItem = await getGroupItem(groupId, config);
  const groupUpdate = groupItem
    ? ddb
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
              connectionId: connectionId,
              vote: groupItem.connections[userId]?.vote || VOTE_NOTE_VOTED,
            },
          },
          ReturnValues: 'UPDATED_NEW',
        })
        .promise()
    : ddb
        .put({
          TableName: tableName,
          Item: {
            primaryKey: `groupId:${groupId}`,
            ttl: Math.floor(Date.now() / 1000 + parseFloat(EXPIRY_TIME_IN_HOUR) * 60 * 60),
            connections: {
              [userId]: { connectionId: connectionId, vote: VOTE_NOTE_VOTED },
            },
            groupId,
            scale: COHEN_SCALE,
          },
        })
        .promise();
  await Promise.all([
    ddb
      .update({
        TableName: tableName,
        Key: {
          primaryKey: `connectionId:${connectionId}`,
        },
        UpdateExpression: 'set userId = :userId, groupId = :groupId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':groupId': groupId,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise(),
    groupUpdate,
  ]);
  await broadcastState(groupId, config);
}
