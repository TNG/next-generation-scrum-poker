import classes from './LegalNoticeContainer.module.css';
import { useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { LegalNotice } from '../LegalNotice/LegalNotice';

export const LegalNoticeContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = (event: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) => {
    setIsExpanded(!isExpanded);
    event.preventDefault();
  };
  return (
    <div class={classes.legalNoticeContainer}>
      Check&nbsp;
      <a href="#" onClick={expand}>
        privacy&nbsp;notice&nbsp;&amp;&nbsp;imprint
      </a>
      &nbsp;(German)
      {isExpanded ? <LegalNotice /> : null}
    </div>
  );
};
