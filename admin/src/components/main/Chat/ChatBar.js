import React, { useState, useEffect } from 'react';
import useFetch from '../../../untils/use-fetch';

import styles from './Chat.module.css';
import getAvatar from '../../../untils/getAvatar';

const ChatBar = ({ socket, parentCallback }) => {
  const [conversations, setConversations] = useState();
  const [cvsLength, setCvsLength] = useState();

  const { fetchUrl: fetchData } = useFetch();

  useEffect(() => {
    socket.on('reload', ({ cvsLength }) => {
      setCvsLength(cvsLength);
    });
  }, [socket]);

  useEffect(() => {
    fetchData({ url: '/api/conversations' }, data => {
      setConversations(data);
    });
  }, [cvsLength, fetchData]);

  return (
    <div className={styles.chatSidebar}>
      <h2>Open Chat</h2>
      <div>
        <h4 className={styles.chatHeader}>ACTIVE USERS</h4>
        {conversations &&
          conversations.map(conversation => (
            <div
              className={styles.chatUsers}
              key={conversation._id}
              onClick={e => {
                socket.emit('user-join-room', {
                  cid: conversation._id,
                });
                parentCallback(conversation._id);
              }}>
              <div>
                <img
                  src={getAvatar(conversation.clientUserName)}
                  alt='avatar'
                />
              </div>
              <div className={styles.clientUserName}>
                <p>{conversation.clientUserName}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatBar;
