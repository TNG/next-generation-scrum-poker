import { Config } from './types';
import { getConnectionItem, getGroupItem } from './get-item';
import { persistResetVotes } from './reset-votes';
import { broadcastState } from './broadcast-state';
import { CardValue } from './shared/WebSocketMessages';

export async function setScale(scale: CardValue[], config: Config): Promise<void> {
  const connectionItem = await getConnectionItem(config);
  const groupItem = await getGroupItem(connectionItem.groupId, config);
  if (!groupItem) return;
  await config.ddb
    .update({
      TableName: config.tableName,
      Key: {
        primaryKey: `groupId:${connectionItem.groupId}`,
      },
      UpdateExpression: 'SET scale = :scale',
      ExpressionAttributeValues: {
        ':scale': scale,
      },
      ReturnValues: 'UPDATED_NEW',
    })
    .promise();
  await persistResetVotes(groupItem, connectionItem, config);
  await broadcastState(connectionItem.groupId, config);
}
