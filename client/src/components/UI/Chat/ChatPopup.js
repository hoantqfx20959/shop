import { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'reactstrap';

import useFetch from '../../../untils/use-fetch';

import styles from './Chat.module.css';

import Modal from '../Modal/Modal';

import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

// định hình chat
const ChatPopup = ({ socket, parentCallback, isShow }) => {
  const lastMessageRef = useRef(null);
  const isShowRef = useRef(null);
  const [typingStatus, setTypingStatus] = useState();
  const [conversation, setConversation] = useState();
  const [isSended, setIsSended] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const { fetchUrl: fetchData } = useFetch();

  const cbConversationFooter = data => {
    setIsSended(data);
  };

  useEffect(() => {
    socket.on('user-typing', ({ cid, uid, isTyping, name }) => {
      setTypingStatus({ cid, uid, isTyping, name });
    });
    socket.on('receive-message', ({ sender, newMessage, timeMessage }) => {
      setNewMessage({ sender, newMessage, timeMessage });
    });
  }, [socket]);

  useEffect(() => {
    fetchData(
      { url: `/api/conversation-by-client/${localStorage.userId}` },
      data => {
        setConversation(data);
      }
    );
  }, [isSended, newMessage, fetchData]);

  useEffect(() => {
    isShowRef.current?.scrollIntoView({
      behavior: 'instant',
    });
  }, [isShow]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
    if (isSended) setIsSended(false);
  }, [conversation, isSended]);

  return (
    <Modal className={styles.modal}>
      <div className={styles.chatContainer}>
        <Row className={styles.header}>
          <Col className={`${styles.headerTitle} col-8`}>
            <h3>Customer Support</h3>
          </Col>
          <Col className={`${styles.headerAction} col-4`}>
            <button onClick={e => parentCallback(!isShow)}>LEAVE CHAT</button>
          </Col>
        </Row>
        <Row>
          <Col>
            <ChatBody
              socket={socket}
              conversation={conversation}
              isSend={isSended}
              lastMessageRef={lastMessageRef}
              isShowRef={isShowRef}
              typingStatus={typingStatus}
              isShow={isShow}
            />
            <ChatFooter socket={socket} parentCallback={cbConversationFooter} />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ChatPopup;
