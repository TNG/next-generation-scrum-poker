import { Config } from '../../shared/config';
import { removeConnection } from '../../shared/removeConnection';

export const onDisconnect = async (config: Config) => {
  try {
    await removeConnection(config);
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
