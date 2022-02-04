import classes from './App.module.css';
import { PageSelector } from '../PageSelector/PageSelector';
import { TouchDetector } from '../TouchDetector/TouchDetector';
import { WebSocketProvider } from '../WebSocket/WebSocket';

export const App = () => (
  <div class={classes.app}>
    <WebSocketProvider>
      <TouchDetector>
        <PageSelector />
      </TouchDetector>
    </WebSocketProvider>
  </div>
);
