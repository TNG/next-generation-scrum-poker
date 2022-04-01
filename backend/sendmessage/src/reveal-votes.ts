import { ConfigWithHandler } from '../../shared/config';
import { getConnectionItem } from '../../shared/getConnectionItem';
import { broadcastState } from './broadcast-state';

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
    })
    .promise();
  await broadcastState(groupId, config);
};
