import { useEffect, useRef } from 'preact/hooks';
import { BUTTON_CONNECTING, BUTTON_RESET_VOTES, RESET_VOTES_CONFIRMATION } from '../../constants';
import sharedClasses from '../../styles.module.css';
import { connectToWebSocket } from '../WebSocket/WebSocket';

export const ResetButton = connectToWebSocket(({ socket }) => {
  const locked = useRef<boolean>(true);

  const handleClick = () => {
    (!locked.current || window.confirm(RESET_VOTES_CONFIRMATION)) && socket.resetVotes();
  };

  useEffect(() => {
    setTimeout(() => {
      locked.current = false;
    }, 2000);
  }, []);

  return (
    <button class={sharedClasses.button} onClick={handleClick} disabled={!socket.connected}>
      {socket.connected ? BUTTON_RESET_VOTES : BUTTON_CONNECTING}
    </button>
  );
});
