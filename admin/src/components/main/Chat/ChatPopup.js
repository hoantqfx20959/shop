import { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'reactstrap';

import useFetch from '../../../untils/use-fetch';

import styles from './Chat.module.css';

import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatBar from './ChatBar';
import Content from '../../common/Content/Content';

// định hình chat
const ChatPopup = ({ socket }) => {
  const [typingStatus, setTypingStatus] = useState();
  const lastMessageRef = useRef(null);
  const isShowRef = useRef(null);
  const [conversationId, setConversationId] = useState();
  const [conversation, setConversation] = useState();
  const [isSended, setIsSended] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const { fetchUrl: fetchData } = useFetch();

  const cbConversationBar = data => {
    setConversationId(data);
  };

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
    if (conversationId) {
      fetchData({ url: `/api/conversation/${conversationId}` }, data => {
        setConversation(data);
      });
    }
  }, [isSended, newMessage, fetchData, conversationId]);

  useEffect(() => {
    isShowRef.current?.scrollIntoView({
      behavior: 'instant',
    });
  }, [conversationId]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
    if (isSended) setIsSended(false);
  }, [conversation, isSended]);

  return (
    <Content>
      <div className={styles.chatContainer}>
        <Row className={styles.header}>
          <Col className={`${styles.headerTitle} col-8`}>
            <h3>Customer Support</h3>
          </Col>
          <Col className={`${styles.headerAction} col-4`}>
            <h4>{conversation && conversation.clientUserName}</h4>
          </Col>
        </Row>

        <Row>
          <Col className={`col-4`}>
            <ChatBar parentCallback={cbConversationBar} socket={socket} />
          </Col>
          {conversationId && (
            <Col className={`col-8`}>
              <ChatBody
                conversation={conversation}
                typingStatus={typingStatus}
                isShowRef={isShowRef}
                lastMessageRef={lastMessageRef}
              />
              <ChatFooter
                socket={socket}
                conversationId={conversationId}
                parentCallback={cbConversationFooter}
              />
            </Col>
          )}
        </Row>
      </div>
    </Content>
  );
};

export default ChatPopup;
