import tngLogo from '../img/tng.svg';
import classes from './Header.module.css';
import { TNG_URL } from '../constants';

export const Header = () => (
  <header className={classes.header}>
    NEXT&nbsp;GENERATION SCRUM&nbsp;POKER
    <a href={TNG_URL} target="_blank" className={classes.logo}>
      <img src={tngLogo} alt="TNG Logo" className={classes.logoImage} />
    </a>
  </header>
);
