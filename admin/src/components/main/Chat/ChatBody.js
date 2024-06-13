import getAvatar from '../../../untils/getAvatar';
import styles from './Chat.module.css';

const ChatBody = ({
  conversation,
  typingStatus,
  isShowRef,
  lastMessageRef,
}) => {
  return (
    <div className={styles.bodyContent}>
      {conversation &&
        conversation.messages.map((message, index) =>
          message.username === localStorage.username ? (
            <div className={styles.leftMess} key={message._id}>
              <div className={styles.leftBodyMess}>
                <div className={styles.messageSender}>
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.rightMess} key={message._id}>
              {index === 0 ||
              (index > 0 &&
                conversation.messages[index].username !==
                  conversation.messages[index - 1].username) ? (
                <div className={styles.username}>
                  <img src={getAvatar(message.username)} alt='avatar' />
                </div>
              ) : (
                <div className={styles.username}></div>
              )}
              <div className={styles.rightBodyMess}>
                <div className={styles.messageRecipient}>
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          )
        )}
      <div className={styles.space}></div>
      <div className={styles.typing}>
        {typingStatus && typingStatus.isTyping && (
          <p>{typingStatus.name} typing</p>
        )}
      </div>
      <div ref={isShowRef} />
      <div ref={lastMessageRef} />
    </div>
  );
};

export default ChatBody;
