import * as WebSocket from 'ws';
import { onConnect } from '../onconnect/src/on-connect';
import { onDisconnect } from '../ondisconnect/src/on-disconnect';
import { onMessage } from '../sendmessage/src/on-message';
import { ddb } from './dynamo';
import { generateId } from './shared/generateId';

interface WebsocketWithId extends WebSocket {
  id: string;
}

export const startWebSocketServer = () => {
  const wss = new WebSocket.Server({
    port: 8080,
    host: 'localhost',
  });

  wss.on('connection', (ws) => {
    const socketId = generateId(16);
    (ws as WebsocketWithId).id = socketId;

    const config = {
      connectionId: socketId,
      tableName: 'scrum-poker-local',
      ddb,
      handler: {
        postToConnection: (postData: { ConnectionId: string; Data: unknown }) => {
          const client = [...wss.clients].find(
            (client) => (postData.ConnectionId = (client as WebsocketWithId).id)
          );
          const resultPromise = client
            ? new Promise<void>((resolve, reject) =>
                client.send(postData.Data, (error) => (error ? reject(error) : resolve()))
              )
            : Promise.reject(new Error(`Could not find client with id ${postData.ConnectionId}`));
          return { promise: () => resultPromise };
        },
      },
    };

    onConnect(config).then((result) => console.log('Connected', socketId, result));

    ws.on('close', () =>
      onDisconnect(config)
        .then((result) => console.log('Disconnected', socketId, result))
        .catch((error) => console.error('Error disconnecting', error))
    );

    ws.on('unexpected-response', (request, message) =>
      console.error(`Unexpected socket response`, request, message)
    );

    ws.on('error', (error) => console.error('Socket error', error));

    ws.on('message', (data) => {
      const message = JSON.parse(String(data));
      onMessage(message.data, config).catch((error) =>
        console.error('Error processing message', error)
      );
    });
  });
};
