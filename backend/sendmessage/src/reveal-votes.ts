import { Config } from './types';
import { broadcastState } from './broadcast-state';
import { getConnectionItem } from './get-item';

export async function revealVotes(config: Config) {
  const { groupId } = await getConnectionItem(config);
  const updateParams = {
    TableName: config.tableName,
    Key: {
      primaryKey: `groupId:${groupId}`,
    },
    UpdateExpression: 'SET visible = :visibility',
    ExpressionAttributeValues: {
      ':visibility': true,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await config.ddb.update(updateParams).promise();
  await broadcastState(groupId as string, config);
}
