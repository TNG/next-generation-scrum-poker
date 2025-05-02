import { Readable } from 'stream';
import * as WebSocket from 'ws';
import { generateId } from '../../shared/generateId';
import { onConnect } from '../onconnect/src/on-connect';
import { onDisconnect } from '../ondisconnect/src/on-disconnect';
import { onMessage } from '../sendmessage/src/on-message';
import { ConfigWithHandler } from '../shared/types';
import { ddb } from './dynamo';

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

    const config: ConfigWithHandler = {
      connectionId: socketId,
      tableName: 'scrum-poker-local',
      ddb,
      handler: {
        postToConnection: ({ ConnectionId, Data }) => {
          // $metadata is required in the return type
          if (!Data) return Promise.resolve({ $metadata: {} });
          const client = [...wss.clients].find(
            (client) => ConnectionId === (client as WebsocketWithId).id,
          );
          return client
            ? new Promise((resolve, reject) =>
                client.send(
                  Data as Exclude<typeof Data, Readable | Blob | ReadableStream<unknown>>,
                  (error) => (error ? reject(error) : resolve({ $metadata: {} })),
                ),
              )
            : Promise.reject(
                Object.assign(new Error(`Could not find client with id ${ConnectionId}`), {
                  statusCode: 410,
                }),
              );
        },
      },
    };

    onConnect(config).then((result) => console.log('Connected', socketId, result));

    ws.on('close', () =>
      onDisconnect(config)
        .then((result) => console.log('Disconnected', socketId, result))
        .catch((error) => console.error('Error disconnecting', error)),
    );

    ws.on('unexpected-response', (request, message) =>
      console.error(`Unexpected socket response`, request, message),
    );

    ws.on('error', (error) => console.error('Socket error', error));

    ws.on('message', (data) => {
      const message = JSON.parse(String(data));
      onMessage(message.data, config).catch((error) =>
        console.error('Error processing message', error),
      );
    });
  });
};
