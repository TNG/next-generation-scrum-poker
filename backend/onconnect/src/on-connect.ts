import * as AWS from 'aws-sdk';
import { EXPIRY_TIME_IN_HOUR, TABLE_NAME } from './const';

export const onConnect = async (
  ddb: AWS.DynamoDB.DocumentClient,
  connectionId: string | undefined
) => {
  const expiryDate = new Date(Date.now());
  expiryDate.setHours(expiryDate.getHours() + parseFloat(EXPIRY_TIME_IN_HOUR));
  const putParams = {
    TableName: TABLE_NAME,
    Item: {
      primaryKey: `connectionId:${connectionId}`,
      connectionId: connectionId,
      ttl: Math.floor(expiryDate.getTime() / 1000),
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
