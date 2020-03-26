import { React } from '../../node_modules/es-react/dev/index.js';
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
  React.useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');
    socket.onopen = () => {
      socket.send(getLoginRequest('frontend-user', 'awesome-session'));
    };
    socket.onmessage = (event) => {
      setState(JSON.parse(event.data));
    };
    setSocket(socket);
  }, []);

  const setVote = (vote: CardValue) => {
    if (socket) {
      socket.send(getSetVoteRequest(vote));
    }
  };

  const revealVotes = () => {
    if (socket) {
      socket.send(getRevealVotesRequest());
    }
  };

  const resetVotes = () => {
    if (socket) {
      socket.send(getResetVotesRequest());
    }
  };

  const value: WebSocketApi = {
    state,
    setVote,
    revealVotes,
    resetVotes,
  };
  return html` <${WebSocketContext.Provider} value=${value}>${children}<//> `;
};

export const WebSocketConsumer = WebSocketContext.Consumer;
