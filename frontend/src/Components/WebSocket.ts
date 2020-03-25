import {React} from '../../node_modules/es-react/dev/index.js';
import {html} from '../html.js';
import {CardValue, WebSocketApi} from "../types/WebSocket.js";

const WebSocketContext = React.createContext('defaultValue');

export const WebSocketProvider = ({children}) => {
    const socket = new WebSocket('ws://localhost:4000')
    socket.onopen = (e) => {console.log('socket opened with ', e)}
    socket.onmessage = (event) => {console.log('message received with ', event)}

    const value: WebSocketApi = {
        state: {
            resultsVisible: false,
            votes: {
                happyUser: "not-voted",
                otherUser: "3"
            }
        },
        setVote: (vote: CardValue): void => {},
        revealVotes: (): void => {},
        resetVotes: (): void => {}
    };
    return html`
      <${WebSocketContext.Provider} value=${value}>${children}<//>
    `;
};

export const WebSocketConsumer = WebSocketContext.Consumer;
