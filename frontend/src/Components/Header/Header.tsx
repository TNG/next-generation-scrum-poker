import { ALT_TNG_LOGO, TNG_URL } from '../../constants';
import tngLogo from '../../img/tng.svg';
import { ColorModeSwitch } from '../ColorModeSwitch/ColorModeSwitch';
import classes from './Header.module.css';

export const Header = () => (
  <header class={classes.header}>
    <div class={classes.placeholder} />
    <div>
      NEXT&nbsp;GENERATION SCRUM&nbsp;POKER
      <a href={TNG_URL} target="_blank" class={classes.logo}>
        <img src={tngLogo} alt={ALT_TNG_LOGO} class={classes.logoImage} />
      </a>
    </div>
    <ColorModeSwitch />
  </header>
);
