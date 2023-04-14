import { removeConnection } from '../../shared/removeConnection';
import { ConfigWithHandler } from '../../shared/types';

export const onDisconnect = async (config: ConfigWithHandler) => {
  try {
    await removeConnection(config);
  } catch (err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Disconnected.' };
};
