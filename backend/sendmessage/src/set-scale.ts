import { Config } from './types';
import { getConnectionItem, getGroupItem } from './get-item';
import { getResetVotesUpdateParams } from './reset-votes';
import { broadcastState } from './broadcast-state';

export async function setScale(scale: string, config: Config) {
  const connectionItem = await getConnectionItem(
    config.connectionId as string,
    config.tableName,
    config.ddb
  );
  const groupItem = await getGroupItem(
    connectionItem.groupId as string,
    config.tableName,
    config.ddb
  );

  const updateParams = {
    TableName: config.tableName,
    Key: {
      primaryKey: `groupId:${connectionItem.groupId}`,
    },
    UpdateExpression: 'SET scale = :scale',
    ExpressionAttributeValues: {
      ':scale': scale,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await config.ddb.update(updateParams).promise();
  await config.ddb
    .update(getResetVotesUpdateParams(groupItem, config.tableName, connectionItem))
    .promise();
  await Promise.all((await broadcastState(connectionItem.groupId as string, config)) as any);
}
