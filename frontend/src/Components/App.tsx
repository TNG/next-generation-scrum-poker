import classes from './App.module.css';
import { ColorModeProvider } from './ColorModeProvider/ColorModeProvider';
import { PageSelector } from './PageSelector';
import { TouchDetector } from './TouchDetector';
import { WebSocketProvider } from './WebSocket';

export const App = () => (
  <div class={classes.app}>
    <WebSocketProvider>
      <TouchDetector>
        <ColorModeProvider>
          <PageSelector />
        </ColorModeProvider>
      </TouchDetector>
    </WebSocketProvider>
  </div>
);
