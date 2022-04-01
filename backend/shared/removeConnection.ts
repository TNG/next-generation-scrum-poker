import { Config } from './config';
import { getConnectionItem } from './getConnectionItem';

const deleteConnectionItem = ({ connectionId, tableName, ddb }: Config) =>
  ddb
    .delete({
      TableName: tableName,
      Key: {
        primaryKey: `connectionId:${connectionId}`,
      },
    })
    .promise();

const removeConnectionFromGroup = (userId: string, groupId: string, { tableName, ddb }: Config) =>
  ddb
    .update({
      TableName: tableName,
      Key: {
        primaryKey: `groupId:${groupId}`,
      },
      UpdateExpression: 'REMOVE connections.#1.connectionId',
      ExpressionAttributeNames: {
        '#1': userId,
      },
    })
    .promise();

export const removeConnection = async (config: Config): Promise<unknown> => {
  const connectionItem = await getConnectionItem(config);
  if (!connectionItem) return;
  const { groupId, userId } = connectionItem;
  return Promise.all([
    deleteConnectionItem(config),
    userId && groupId && removeConnectionFromGroup(userId, groupId, config),
  ]);
};
