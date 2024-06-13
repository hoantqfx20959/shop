import { useState } from 'react';
import classes from './IconChat.module.css';

// icon chat
const IconChat = ({ parentCallback, socket }) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <i
      className={`fa-solid fa-comments ${classes.icon}`}
      onClick={e => {
        setIsShow(!isShow);
        parentCallback(isShow);
        if (isShow) {
          if (localStorage.isClient === 'true') {
            socket.emit('client-join-room', { clientId: localStorage.userId });
          }
        }
      }}></i>
  );
};

export default IconChat;
