import classes from './PrivacyNoticeContainer.module.css';
import { useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { PrivacyNotice } from '../PrivacyNotice/PrivacyNotice';

export const PrivacyNoticeContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = (event: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) => {
    setIsExpanded(!isExpanded);
    event.preventDefault();
  };
  return (
    <div class={classes.privacyNoticeContainer}>
      Check&nbsp;
      <a href="#" onClick={expand}>
        privacy&nbsp;notice
      </a>
      &nbsp;(German,&nbsp;unfortunately)
      {isExpanded ? <PrivacyNotice /> : null}
    </div>
  );
};
