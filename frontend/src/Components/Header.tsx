import tngLogo from '../img/tng.svg';
import classes from './Header.module.css';
import { TNG_URL } from '../constants';

export const Header = () => (
  <header class={classes.header}>
    NEXT&nbsp;GENERATION SCRUM&nbsp;POKER
    <a href={TNG_URL} target="_blank" class={classes.logo}>
      <img src={tngLogo} alt="TNG Logo" class={classes.logoImage} />
    </a>
  </header>
);
