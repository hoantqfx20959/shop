const User = require('./models/auth');
const Conversation = require('./models/conversation');

module.exports = io => {
  io.on('connection', socket => {
    socket.on('disconnect', _ => {
      socket.emit('user-disconnect');
      socket.disconnect();
    });

    // USER LOGIN
    socket.on('user-login', async uid => {
      const user = await User.findById(uid);
      if (user) {
        user.isOnline = true;
        user.save();
      }
    });

    // USER LOGOUT
    socket.on('user-setOffline', async uid => {
      const user = await User.findById(uid);
      if (user) {
        user.isOnline = false;
        user.save();
      }
    });

    // ADMIN JOIN ROOM
    socket.on('user-join-room', ({ cid }) => {
      socket.join(`cvs-${cid}`);
    });

    // CLIENT JOIN ROOM
    socket.on('client-join-room', async ({ clientId }) => {
      const connection = await Conversation.findOne({ clientId: clientId });
      if (connection) {
        const cvsid = connection._id.toString();
        socket.join(`cvs-${cvsid}`);
      } else {
        const client = await User.findById(clientId);
        const newConversation = await Conversation({
          clientId: client._id,
          clientUserName: client.username,
        });

        await newConversation.save();
        const cvsid = newConversation._id.toString();
        socket.join(`cvs-${cvsid}`);
      }
    });

    // SEND MESSAGE
    socket.on('user-send-message', async ({ cid, uid, username, content }) => {
      let conversation;
      if (cid) {
        conversation = await Conversation.findById(cid);
      } else {
        conversation = await Conversation.findOne({ clientId: uid });
      }
      const currentTime = Date.now();
      conversation.messages.push({
        ofUser: uid,
        username: username,
        content: content,
        time: currentTime,
      });
      conversation.lastMessage = content;
      conversation.lastSender = username;
      conversation.lastUpdate = currentTime;
      await conversation.save();

      const cvsid = conversation._id.toString();

      socket.to(`cvs-${cvsid}`).emit('receive-message', {
        sender: username,
        newMessage: content,
        timeMessage: currentTime,
      });

      const connections = await Conversation.find();
      socket.broadcast.emit('reload', { cvsLength: connections.length });
    });

    // TYPING
    socket.on('user-typing-message', async ({ cid, uid, isTyping, name }) => {
      let conversation;
      if (cid) {
        socket
          .to(`cvs-${cid}`)
          .emit('user-typing', { cid, uid, isTyping, name });
      } else {
        conversation = await Conversation.findOne({ clientId: uid });
        const cvsid = conversation._id.toString();
        socket
          .to(`cvs-${cvsid}`)
          .emit('user-typing', { cid, uid, isTyping, name });
      }
    });
  });
};
