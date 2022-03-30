import { EXPIRY_TIME_IN_HOUR } from './const';
import { Config } from './sharedBackend/config';
import { getTtl } from './sharedBackend/getTtl';

export const onConnect = async ({ ddb, connectionId, tableName }: Config) => {
  try {
    await ddb
      .put({
        TableName: tableName,
        Item: {
          primaryKey: `connectionId:${connectionId}`,
          connectionId,
          ttl: getTtl(EXPIRY_TIME_IN_HOUR),
        },
      })
      .promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
