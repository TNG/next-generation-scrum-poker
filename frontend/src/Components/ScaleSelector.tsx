import { SCALES, SELECT_CHANGE_SCALE } from '../constants';
import { WebSocketApi } from '../types/WebSocket';
import classes from './ScaleSelector.module.css';
import { connectToWebSocket } from './WebSocket';

const ProtoScaleSelector = ({ socket }: { socket: WebSocketApi }) => (
  <select
    name="scale"
    class={classes.select}
    onChange={({ target }) => socket.setScale(SCALES[(target as HTMLSelectElement).value].values)}
    value={'CHANGE_SCALE'}
  >
    <option value="CHANGE_SCALE" disabled hidden>
      {SELECT_CHANGE_SCALE}
    </option>
    {Object.keys(SCALES).map((id) => (
      <option value={id} key={id}>
        {SCALES[id].name}
      </option>
    ))}
  </select>
);

export const ScaleSelector = connectToWebSocket(ProtoScaleSelector);
