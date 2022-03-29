import { getConnectionItem, getGroupItem } from './get-item';
import { persistResetVotes } from './reset-votes';
import { broadcastState } from './broadcast-state';
import { CardValue } from './shared/WebSocketMessages';
import { ConfigWithHandler } from './shared/backendTypes';

export async function setScale(scale: CardValue[], config: ConfigWithHandler): Promise<void> {
  const { groupId } = await getConnectionItem(config);
  if (!groupId) return;
  const groupItem = await getGroupItem(groupId, config);
  if (!groupItem) return;
  await config.ddb
    .update({
      TableName: config.tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'SET scale = :scale',
      ExpressionAttributeValues: {
        ':scale': scale,
      },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise();
  await persistResetVotes(groupItem, groupId, config);
  await broadcastState(groupId, config);
}
