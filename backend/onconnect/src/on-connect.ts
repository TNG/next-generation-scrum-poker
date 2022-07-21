import { createConnection } from '../../shared/database/createConnection';
import { getTtl } from '../../shared/getTtl';
import { Config } from '../../shared/types';
import { EXPIRY_TIME_IN_HOUR } from './const';

export const onConnect = async (config: Config) => {
  try {
    await createConnection(getTtl(EXPIRY_TIME_IN_HOUR), config);
  } catch (err) {
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Connected.' };
};
