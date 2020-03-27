import { WEBSOCKET_URL } from '../config.js';
import React from '../react.js';
import { getLoginRequest, getResetVotesRequest, getRevealVotesRequest, getSetVoteRequest } from '../requests/websocket-requests.js';
import { CardValue, WebSocketApi, WebsocketMessage } from '../types/WebSocket.js';

const WebSocketContext = React.createContext('defaultValue');

export const WebSocketProvider = ({ children }: any) => {
  const initialState = { resultsVisible: false, votes: {} };
  const [socket, setSocket] = React.useState(null);
  const [state, setState] = React.useState(initialState);
  const [loginData, setLoginData] = React.useState(null);

  React.useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);
    socket.onopen = () => setSocket(socket);
    socket.onmessage = (event) => {
      const message: WebsocketMessage = JSON.parse(event.data);
      if (message.type === 'state') {
        setState(message.payload);
      }
    };
  }, []);

  if (!socket) {
    return 'Connecting...';
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
  };
  return (
    <WebSocketContext.Provider value={value} key="provider">
      {children}
    </WebSocketContext.Provider>
  );
};

export const WebSocketConsumer = WebSocketContext.Consumer;

export const connectToWebSocket = (Component) => (...props) => {
  return (
    <WebSocketConsumer>
      {(socket: WebSocketApi) => <Component socket={socket} {...props} />}
    </WebSocketConsumer>
  );
};
