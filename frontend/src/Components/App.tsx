import classes from './App.module.css';
import { PageSelector } from './PageSelector';
import { TouchDetector } from './TouchDetector';
import { WebSocketProvider } from './WebSocket';

export const App = () => (
  <div class={classes.app}>
    <WebSocketProvider>
      <TouchDetector>
        <PageSelector />
      </TouchDetector>
    </WebSocketProvider>
  </div>
);
