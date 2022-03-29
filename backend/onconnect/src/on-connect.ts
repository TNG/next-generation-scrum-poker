import { EXPIRY_TIME_IN_HOUR } from './const';
import { Config } from './sharedBackend/config';

export const onConnect = async ({ ddb, connectionId, tableName }: Config) => {
  try {
    await ddb
      .put({
        TableName: tableName,
        Item: {
          primaryKey: `connectionId:${connectionId}`,
          connectionId,
          ttl: Math.floor(Date.now() / 1000 + parseFloat(EXPIRY_TIME_IN_HOUR) * 60 * 60),
        },
      })
      .promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
