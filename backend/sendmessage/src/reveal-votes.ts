import { broadcastState } from './broadcast-state';
import { getConnectionItem } from './get-item';
import { ConfigWithHandler } from './shared/backendTypes';

export async function revealVotes(config: ConfigWithHandler) {
  const { groupId } = await getConnectionItem(config);
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
}
