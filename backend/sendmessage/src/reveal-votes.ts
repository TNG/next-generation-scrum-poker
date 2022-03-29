import { broadcastState } from './broadcast-state';
import { ConfigWithHandler } from './sharedBackend/config';
import { getConnectionItem } from './sharedBackend/getConnectionItem';

export const revealVotes = async (config: ConfigWithHandler) => {
  const connectionItem = await getConnectionItem(config);
  if (!connectionItem) return;
  const { groupId } = connectionItem;
  if (!groupId) return;

  await config.ddb
    .update({
      TableName: config.tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'SET visible = :visibility',
      ExpressionAttributeValues: {
        ':visibility': true,
      },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise();
  await broadcastState(groupId, config);
};
