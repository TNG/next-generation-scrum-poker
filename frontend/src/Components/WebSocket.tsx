import * as React from '/web_modules/react.js';
import { Component } from 'react';
import { WEBSOCKET_URL } from '../config.js';
import {
  getLoginRequest,
  getRemoveUsersNotVotedRequest,
  getResetVotesRequest,
  getRevealVotesRequest,
  getSetVoteRequest
} from '../requests/websocket-requests.js';
import { CardValue, WebSocketApi, WebSocketLoginData, WebsocketMessage, WebSocketState } from '../types/WebSocket.js';

const doNothing = () => {};

const initialWebSocketState: WebSocketState = { resultsVisible: false, votes: {} };
const WebSocketContext = React.createContext<WebSocketApi>({
  login: doNothing,
  loginData: null,
  state: initialWebSocketState,
  setVote: doNothing,
  revealVotes: doNothing,
  resetVotes: doNothing,
  removeUsersNotVoted: doNothing,
});

export const WebSocketProvider = ({ children }: any) => {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [state, setState] = React.useState(initialWebSocketState);
  const [loginData, setLoginData] = React.useState<WebSocketLoginData>(null);

  React.useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);
    socket.onopen = () => setSocket(socket);
    socket.onmessage = (event) => {
      const message: WebsocketMessage = JSON.parse(event.data);
      if (message.type === 'state') {
        setState(message.payload);
      }
      if (message.type === 'not-logged-in') {
        setState(initialWebSocketState);
        setLoginData(null);
      }
    };
  }, []);

  if (!socket) {
    return <div>'Connecting...'</div>;
  }

  const login = (user: string, session: string) => {
    socket.send(getLoginRequest(user, session));
    setLoginData({ user, session });
  };

  const setVote = (vote: CardValue) => {
    socket.send(getSetVoteRequest(vote));
  };

  const revealVotes = () => {
    socket.send(getRevealVotesRequest());
  };

  const removeUsersNotVoted = () => {
    socket.send(getRemoveUsersNotVotedRequest());
  };

  const resetVotes = () => {
    socket.send(getResetVotesRequest());
  };

  const value: WebSocketApi = {
    login,
    loginData,
    state,
    setVote,
    revealVotes,
    resetVotes,
    removeUsersNotVoted,
  };
  return (
    <WebSocketContext.Provider value={value} key="provider">
      {children}
    </WebSocketContext.Provider>
  );
};

export const WebSocketConsumer = WebSocketContext.Consumer;

type ConnectToWebSocket<P extends {} = {}> = (
  Component: React.ComponentType<
    {
      [K in keyof P | 'socket']: K extends 'socket'
        ? WebSocketApi
        : K extends keyof P
        ? P[K]
        : never;
    }
  >
) => React.ComponentType<P>;

export const connectToWebSocket: ConnectToWebSocket = (Component) => (
  ...props
) => {
  return (
    <WebSocketConsumer>
      {(socket: WebSocketApi) => <Component socket={socket} {...props} />}
    </WebSocketConsumer>
  );
};
