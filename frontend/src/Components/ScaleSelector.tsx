import { SCALES, SELECT_CHANGE_SCALE } from '../constants';
import classes from './ScaleSelector.module.css';
import { connectToWebSocket } from './WebSocket';

export const ScaleSelector = connectToWebSocket(({ socket }) => (
  <select
    name="scale"
    class={classes.select}
    onChange={(e) => socket.setScale(SCALES[(e.target as HTMLSelectElement).value].values)}
    value={'CHANGE_SCALE'}
  >
    <option value="CHANGE_SCALE" disabled>
      {SELECT_CHANGE_SCALE}
    </option>
    {Object.keys(SCALES).map((id) => (
      <option value={id} key={id}>
        {SCALES[id].name}
      </option>
    ))}
  </select>
));
