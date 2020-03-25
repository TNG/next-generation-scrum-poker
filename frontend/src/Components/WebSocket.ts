import {React} from '../../node_modules/es-react/dev/index.js';
import {html} from '../html.js';
import {CardValue, WebSocketApi} from "../types/WebSocket.js";

const WebSocketContext = React.createContext('defaultValue');

const DUMMY_LOGIN_REQUEST = {
    "type": "login",
    "payload": {
        "user": "new user",
        "session": "my-awesome-session"
    }
};

export const WebSocketProvider = ({children}) => {
    const initialState = {resultsVisible: false, votes: {}};
    const [state, setState] = React.useState(initialState);
    let socket: WebSocket;
    React.useEffect(() => {
        socket = new WebSocket('ws://localhost:4000');
        socket.onopen = () => {
            socket.send(JSON.stringify(DUMMY_LOGIN_REQUEST));
        };
        socket.onmessage = (event) => {
            setState(JSON.parse(event.data))
        };
    },[]);

    const value: WebSocketApi = {
        state,
        setVote: (vote: CardValue): void => {},
        revealVotes: (): void => {},
        resetVotes: (): void => {}
    };
    return html`
      <${WebSocketContext.Provider} value=${value}>${children}<//>
    `;
};

export const WebSocketConsumer = WebSocketContext.Consumer;
