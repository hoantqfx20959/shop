import React, { useRef, useState } from 'react';

import styles from './Chat.module.css';
import { Col, Row } from 'reactstrap';

const ChatFooter = ({ socket, parentCallback }) => {
  const chatFieldRef = useRef(null);
  const [isSending, setSending] = useState(false);

  let timeout = null;
  const myUsername = localStorage.username;
  const myUserId = localStorage.userId;

  const handleSendMessage = e => {
    e.preventDefault();

    const content = chatFieldRef.current.value;
    chatFieldRef.current.value = '';
    if (!content || content === '') return;
    setSending(true);
    parentCallback(true);

    if (timeout) clearTimeout(timeout);
    stoppedTyping();
    socket.emit('user-send-message', {
      uid: myUserId,
      username: myUsername,
      content: content,
    });

    setSending(false);
  };

  const stoppedTyping = () => {
    socket.emit('user-typing-message', {
      uid: myUserId,
      isTyping: false,
    });
  };

  return (
    <form className={styles.footerForm} onSubmit={handleSendMessage}>
      <Row>
        <Col className='col-6'>
          <input
            type='search'
            ref={chatFieldRef}
            className={styles.input}
            onChange={() => {
              socket.emit('user-typing-message', {
                uid: myUserId,
                isTyping: true,
                name: myUsername,
              });
              if (timeout) clearTimeout(timeout);
              timeout = setTimeout(stoppedTyping, 1500);
            }}
            onKeyPress={event => {
              if (event.key === 'Enter' || event.keyCode === 13) {
                handleSendMessage(event);
              }
            }}
            placeholder='Input your message...'
          />
        </Col>
        <Col className={`${styles.action} col-6`}>
          <i className={`fa-solid fa-paperclip ${styles.footerIcon}`}></i>
          <i className={`fa-solid fa-face-smile ${styles.footerIcon}`}></i>
          <button className={styles.footerBtn} disabled={isSending}>
            <i className={`fa-solid fa-paper-plane ${styles.footerIcon}`}></i>
          </button>
        </Col>
      </Row>
    </form>
  );
};

export default ChatFooter;
