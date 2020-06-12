import * as React from 'react';
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
const initialLoginData: WebSocketLoginData = { user: '', session: '' };
const WebSocketContext = React.createContext<WebSocketApi>({
  login: doNothing,
  loginData: initialLoginData,
  loggedIn: false,
  state: initialWebSocketState,
  setVote: doNothing,
  revealVotes: doNothing,
  resetVotes: doNothing,
  removeUsersNotVoted: doNothing,
});

export const WebSocketProvider = ({ children }: any) => {
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [state, setState] = React.useState(initialWebSocketState);
  const [loginData, setLoginData] = React.useState(initialLoginData);
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (!socket) {
      const webSocket = new WebSocket(WEBSOCKET_URL);
      webSocket.onopen = () => {
        if (loginData.user && loginData.session) {
          webSocket.send(getLoginRequest(loginData.user, loginData.session));
        }
        setSocket(webSocket);
      };
      webSocket.onmessage = (event: any) => {
        const message: WebsocketMessage = JSON.parse(event.data);
        if (message.type === 'state') {
          setState(message.payload);
        }
        if (message.type === 'not-logged-in') {
          setState(initialWebSocketState);
          setLoggedIn(false);
        }
      };
      webSocket.onclose = () => {
        setSocket(null);
      };
    }
  }, [socket]);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  const login = (user: string, session: string) => {
    socket.send(getLoginRequest(user, session));
    setLoginData({ user, session });
    setLoggedIn(true);
  };

  const setVote = (vote: CardValue) => {
    socket.send(getSetVoteRequest(vote));
    setState({ ...state, votes: { ...state.votes, [loginData.user]: vote } });
  };

  const revealVotes = () => {
    socket.send(getRevealVotesRequest());
    setState({
      ...state,
      resultsVisible: true,
    });
  };

  const removeUsersNotVoted = () => {
    socket.send(getRemoveUsersNotVotedRequest());
    setState({
      ...state,
      votes: Object.fromEntries(
        Object.entries(state.votes).filter(([, voted]) => voted !== 'not-voted')
      ),
    });
  };

  const resetVotes = () => {
    socket.send(getResetVotesRequest());
    setState({
      votes: Object.fromEntries(Object.keys(state.votes).map((user) => [user, 'not-voted'])),
      resultsVisible: false,
    });
  };

  const value: WebSocketApi = {
    login,
    loginData,
    loggedIn,
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

export const connectToWebSocket: ConnectToWebSocket = (Component) => (...props) => {
  return (
    <WebSocketConsumer>
      {(socket: WebSocketApi) => <Component socket={socket} {...props} />}
    </WebSocketConsumer>
  );
};
