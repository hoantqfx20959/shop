import socketIO from 'socket.io-client';
import URL from './url';

const socket = socketIO(URL.BASE, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

// socket.on('connection', () => {
//   if (localStorage.userId) {
//     socket.emit('user-login', localStorage.userId);
//   }
// });

socket.on('disconnect', () => {
  if (localStorage.userId) {
    socket.emit('user-setOffline', localStorage.userId);
  }
});

export default socket;
