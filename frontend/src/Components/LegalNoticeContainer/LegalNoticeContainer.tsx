import { useEffect, useRef, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { LegalNotice } from '../LegalNotice/LegalNotice';
import classes from './LegalNoticeContainer.module.css';

const MIN_VISIBLE_INITIAL_HEIGHT = 250;

export const LegalNoticeContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = (event: JSXInternal.TargetedMouseEvent<HTMLAnchorElement>) => {
    setIsExpanded(!isExpanded);
    event.preventDefault();
  };
  useEffect(() => {
    if (isExpanded && containerRef.current) {
      const { top } = containerRef.current.getBoundingClientRect();
      const visibleHeight = (window.innerHeight || document.documentElement.clientHeight) - top;
      if (visibleHeight < MIN_VISIBLE_INITIAL_HEIGHT) {
        window.scrollBy({ top: MIN_VISIBLE_INITIAL_HEIGHT - visibleHeight, behavior: 'smooth' });
      }
    }
  }, [isExpanded]);
  return (
    <div class={classes.legalNoticeContainer} ref={containerRef}>
      Check&nbsp;
      <a href="#" onClick={expand}>
        privacy&nbsp;notice&nbsp;&amp;&nbsp;imprint
      </a>
      &nbsp;(English)
      {isExpanded ? <LegalNotice /> : null}
    </div>
  );
};
