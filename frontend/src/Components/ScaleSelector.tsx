import { SCALES } from '../constants';
import { WebSocketApi } from '../types/WebSocket';
import classes from './ScaleSelector.module.css';
import { connectToWebSocket } from './WebSocket';

const ProtoScaleSelector = ({ socket }: { socket: WebSocketApi }) => (
  <select
    name="scale"
    className={classes.select}
    onChange={(e) => socket.setScale(SCALES[(e.target as HTMLSelectElement).value].values)}
    value={'CHANGE_SCALE'}
  >
    <option value="CHANGE_SCALE" disabled>
      Change Scale
    </option>
    {Object.keys(SCALES).map((id) => (
      <option value={id} key={id}>
        {SCALES[id].name}
      </option>
    ))}
  </select>
);

export const ScaleSelector = connectToWebSocket(ProtoScaleSelector);
