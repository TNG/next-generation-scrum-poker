import { HEADING_SELECT_CARD } from '../../constants';
import sharedClasses from '../../styles.module.css';
import { CardSelector } from '../CardSelector/CardSelector';
import { RevealButton } from '../RevealButton/RevealButton';
import { ScaleSelector } from '../ScaleSelector/ScaleSelector';
import { VotingStateDisplay } from '../VotingStateDisplay/VotingStateDisplay';
import classes from './VotingPage.module.css';

export const VotingPage = () => (
  <div class={classes.votingPage}>
    <h1 class={sharedClasses.heading}>{HEADING_SELECT_CARD}</h1>
    <CardSelector />
    <RevealButton />
    <VotingStateDisplay />
    <ScaleSelector />
  </div>
);
