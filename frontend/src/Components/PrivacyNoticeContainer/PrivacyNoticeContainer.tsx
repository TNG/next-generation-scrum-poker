import classes from './PrivacyNoticeContainer.module.css';
import { useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { PrivacyNotice } from '../PrivacyNotice/PrivacyNotice';

export const PrivacyNoticeContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = (event: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) => {
    setIsExpanded(true);
    event.preventDefault();
  };
  return isExpanded ? (
    <PrivacyNotice />
  ) : (
    <div class={classes.privacyNoticeContainer}>
      Learn how we respect your&nbsp;
      <a href="#" onClick={expand}>
        privacy
      </a>
      .
    </div>
  );
};
