import { broadcastState } from './broadcast-state';
import { CardValue } from './shared/cards';
import { Config, ConfigWithHandler } from './sharedBackend/config';
import { getConnectionItem } from './sharedBackend/getConnectionItem';

export const setVote = async (vote: CardValue, config: ConfigWithHandler) => {
  const connectionItem = await getConnectionItem(config);
  if (!connectionItem) return;
  const { groupId, userId } = connectionItem;
  if (!(groupId && userId)) return;

  await updateVote(groupId, userId, vote, config);
  await broadcastState(groupId, config);
};

const updateVote = (groupId: string, userId: string, vote: CardValue, { ddb, tableName }: Config) =>
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
      ReturnValues: 'UPDATED_NEW',
    })
    .promise();
