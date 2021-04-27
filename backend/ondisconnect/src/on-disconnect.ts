import * as AWS from 'aws-sdk';
import { TABLE_NAME } from './const';

export const onDisconnect = async (
  ddb: AWS.DynamoDB.DocumentClient,
  connectionId: string | undefined
) => {
  const deleteParams = {
    TableName: TABLE_NAME,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
  };
  const queryItemParams = {
    TableName: TABLE_NAME,
    ConsistentRead: true,
    Key: {
      primaryKey: `connectionId:${connectionId}`,
    },
  };

  try {
    const connectionItem = (await ddb.get(queryItemParams).promise()).Item;
    await ddb.delete(deleteParams).promise();
    if (connectionItem && connectionItem.groupId) {
      const updateParams = {
        TableName: TABLE_NAME,
        Key: {
          primaryKey: `groupId:${connectionItem.groupId}`,
        },
        UpdateExpression: 'REMOVE #1.connectionId',
        ExpressionAttributeNames: {
          '#1': connectionItem.userId,
        },
      };
      await ddb.update(updateParams).promise();
    }
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
