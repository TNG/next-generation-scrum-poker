import classes from './App.module.css';
import { PageSelector } from '../PageSelector/PageSelector';
import { TouchDetector } from '../TouchDetector/TouchDetector';
import { WebSocketProvider } from '../WebSocket/WebSocket';
import { ColorModeProvider } from '../ColorModeProvider/ColorModeProvider';

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
