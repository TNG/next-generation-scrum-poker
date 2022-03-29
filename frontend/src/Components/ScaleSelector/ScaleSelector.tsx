import { SELECT_CHANGE_SCALE } from '../../constants';
import { ScaleName, SCALES } from '../../shared/scales';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './ScaleSelector.module.css';

export const ScaleSelector = connectToWebSocket(({ socket }) => (
  <select
    name="scale"
    class={classes.select}
    onChange={({ target }) =>
      socket.setScale(SCALES[(target as HTMLSelectElement).value as ScaleName].values)
    }
    value={'CHANGE_SCALE'}
  >
    <option value="CHANGE_SCALE" disabled hidden>
      {SELECT_CHANGE_SCALE}
    </option>
    {Object.keys(SCALES).map((id) => (
      <option value={id} key={id}>
        {SCALES[id as ScaleName].name}
      </option>
    ))}
  </select>
));
