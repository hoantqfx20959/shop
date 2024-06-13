import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import socketIO from 'socket.io-client';

import Home from './pages/Home.js';
import Auth from './pages/Auth/Auth.js';
import ResetPass from './pages/Auth/ResetPass.js';
import NewPass from './pages/Auth/NewPass.js';
import Shop from './pages/Shop.js';
import Detail from './pages/Detail.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import Orders from './pages/Orders.js';
import OrderDetail from './components/main/Orders/OrderDetail.js';

import Navbar from './components/common/Navbar/Navbar.jsx';
import IconChat from './components/UI/Chat/IconChat.js';
import ChatPopup from './components/UI/Chat/ChatPopup.js';
import URL from './untils/url.js';

const socket = socketIO(URL.BASE, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

function App() {
  const token = localStorage.token;
  const [isShow, setIsShow] = useState(false);

  const callbackChild = data => {
    setIsShow(data);
  };

  return (
    <BrowserRouter>
      <Container>
        <Navbar socket={socket} />
        {token && <IconChat parentCallback={callbackChild} socket={socket} />}
        {isShow && (
          <ChatPopup
            parentCallback={callbackChild}
            socket={socket}
            isShow={isShow}
          />
        )}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Auth socket={socket} />} />
          <Route path='/reset-password' element={<ResetPass />} />
          <Route path='/new-password/:token' element={<NewPass />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/order/:id' element={<OrderDetail />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
