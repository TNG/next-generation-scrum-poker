import { ComponentType, createContext } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { WEBSOCKET_URL } from '../config';
import { SCALES, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../constants';
import {
  getLoginRequest,
  getRemoveUsersNotVotedRequest,
  getResetVotesRequest,
  getRevealVotesRequest,
  getSetScaleRequest,
  getSetVoteRequest,
} from '../requests/websocket-requests';
import {
  CardValue,
  Votes,
  WebSocketApi,
  WebSocketLoginData,
  WebsocketMessage,
  WebSocketState,
} from '../types/WebSocket';

const doNothing = () => {};

const initialWebSocketState: WebSocketState = {
  resultsVisible: false,
  votes: {},
  scale: SCALES.COHEN_SCALE.values,
};
const initialLoginData: WebSocketLoginData = { user: '', session: '' };
const WebSocketContext = createContext<WebSocketApi>({
  connected: false,
  login: doNothing,
  loginData: initialLoginData,
  loggedIn: false,
  state: initialWebSocketState,
  setVote: doNothing,
  setScale: doNothing,
  revealVotes: doNothing,
  resetVotes: doNothing,
  removeUsersNotVoted: doNothing,
});

function getInitialVotes(votes: Votes): Votes {
  return Object.fromEntries(
    Object.keys(votes).map((user) => [
      user,
      votes[user] === VOTE_OBSERVER ? VOTE_OBSERVER : VOTE_NOTE_VOTED,
    ])
  );
}

export const WebSocketProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, setState] = useState(initialWebSocketState);
  const [loginData, setLoginData] = useState(initialLoginData);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
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

  const login = (user: string, session: string) => {
    socket!.send(getLoginRequest(user, session));
    setLoginData({ user, session });
    setLoggedIn(true);
    // Optimistically show the non-voted state of the current user
    setState({
      ...initialWebSocketState,
      votes: {
        [user]: VOTE_NOTE_VOTED,
      },
    });
  };

  const setVote = (vote: CardValue) => {
    socket!.send(getSetVoteRequest(vote));
    setState({ ...state, votes: { ...state.votes, [loginData.user]: vote } });
  };

  const setScale = (scale: Array<CardValue>) => {
    socket!.send(getSetScaleRequest(scale));
    setState({ ...state, votes: getInitialVotes(state.votes), scale });
  };

  const revealVotes = () => {
    socket!.send(getRevealVotesRequest());
    setState({
      ...state,
      resultsVisible: true,
    });
  };

  const removeUsersNotVoted = () => {
    socket!.send(getRemoveUsersNotVotedRequest());
    setState({
      ...state,
      votes: Object.fromEntries(
        Object.entries(state.votes).filter(([, voted]) => voted !== VOTE_NOTE_VOTED)
      ),
    });
  };

  const resetVotes = () => {
    socket!.send(getResetVotesRequest());
    setState({
      votes: getInitialVotes(state.votes),
      resultsVisible: false,
      scale: state.scale,
    });
  };

  const value: WebSocketApi = {
    connected: Boolean(socket),
    login,
    loginData,
    loggedIn,
    state,
    setVote,
    setScale,
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
  Component: ComponentType<
    {
      [K in keyof P | 'socket']: K extends 'socket'
        ? WebSocketApi
        : K extends keyof P
        ? P[K]
        : never;
    }
  >
) => ComponentType<P>;

export const connectToWebSocket: ConnectToWebSocket = (Component) => (...props) => {
  return (
    <WebSocketConsumer>
      {(socket: WebSocketApi) => <Component socket={socket} {...props} />}
    </WebSocketConsumer>
  );
};
