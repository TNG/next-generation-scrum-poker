import { Config } from './types';
import { broadcastState } from './broadcast-state';
import { getConnectionItem } from './get-item';

export async function revealVotes(config: Config) {
  const connectionItem = await getConnectionItem(
    config.connectionId as string,
    config.tableName,
    config.ddb
  );
  const updateParams = {
    TableName: config.tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: 'SET visible = :visibility',
    ExpressionAttributeValues: {
      ':visibility': true,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await config.ddb.update(updateParams).promise();
  await Promise.all((await broadcastState(connectionItem.groupId as string, config)) as any);
}
