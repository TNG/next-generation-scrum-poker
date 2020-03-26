import React from '../../node_modules/es-react/dev/react.js';
import { html } from '../html.js';
import {
  getLoginRequest,
  getResetVotesRequest,
  getRevealVotesRequest,
  getSetVoteRequest,
} from '../requests/websocket-requests.js';
import { CardValue, WebSocketApi } from '../types/WebSocket.js';

const WebSocketContext = React.createContext('defaultValue');

export const WebSocketProvider = ({ children }) => {
  const initialState = { resultsVisible: false, votes: {} };
  const [socket, setSocket] = React.useState(null);
  const [state, setState] = React.useState(initialState);
  const [loginData, setLoginData] = React.useState(null);

  React.useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');
    socket.onopen = () => setSocket(socket);
    socket.onmessage = (event) => {
      setState(JSON.parse(event.data));
    };
  }, []);

  if (!socket) {
    return html`Connecting...`;
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
  return html`<${WebSocketContext.Provider} value=${value} key="provider">${children}<//> `;
};

export const WebSocketConsumer = WebSocketContext.Consumer;

export const connectToWebSocket = (Component) => (...props) => {
  return html`<${WebSocketConsumer}
    >${(socket: WebSocketApi) => html`<${Component} socket=${socket} ...${props} />`}<//
  >`;
};
