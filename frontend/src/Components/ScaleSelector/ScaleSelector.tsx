import { ScaleName, SCALES } from '../../../../shared/scales';
import { SELECT_CHANGE_SCALE } from '../../constants';
import { connectToWebSocket } from '../WebSocket/WebSocket';
import classes from './ScaleSelector.module.css';

export const ScaleSelector = connectToWebSocket(({ socket: { connected, setScale } }) => (
  <select
    disabled={!connected}
    name="scale"
    class={classes.select}
    onChange={({ target }) =>
      setScale(SCALES[(target as HTMLSelectElement).value as ScaleName].values)
    }
    value={'CHANGE_SCALE'}
  >
    <option value="CHANGE_SCALE" selected disabled hidden>
      {SELECT_CHANGE_SCALE}
    </option>
    {Object.entries(SCALES).map(([id, { name }]) => (
      <option value={id} key={id}>
        {name}
      </option>
    ))}
  </select>
));
