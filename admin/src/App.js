import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import socketIO from 'socket.io-client';

import Home from './pages/Home.js';
import Auth from './pages/Auth/Auth.js';
import ResetPass from './pages/Auth/ResetPass.js';
import NewPass from './pages/Auth/NewPass.js';
import User from './components/main/User.js';
import Category from './components/main/Category.js';
import Product from './components/main/Product.js';
import Order from './components/main/Order.js';
import OrderDetail from './components/main/OrderDetail.js';
import NewCategory from './components/main/form/CategoryForm.js';
import NewProduct from './components/main/form/ProductForm.js';
import EditCategory from './components/main/form/CategoryForm.js';
import EditProduct from './components/main/form/ProductForm.js';
import Conversation from './components/main/Chat/ChatPopup';

import Navbar from './components/common/Navbar/Navbar.jsx';
import URL from './untils/url.js';

const socket = socketIO(URL.BASE, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Navbar socket={socket} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Auth socket={socket} />} />
          <Route path='/reset-password' element={<ResetPass />} />
          <Route path='/new-password/:token' element={<NewPass />} />
          <Route path='/users' element={<User />} />
          <Route path='/categories' element={<Category />} />
          <Route path='/products' element={<Product />} />
          <Route path='/orders' element={<Order />} />{' '}
          <Route path='/order/:id' element={<OrderDetail />} />
          <Route path='/new-category' element={<NewCategory />} />
          <Route path='/new-product' element={<NewProduct />} />
          <Route path='/edit-category/:id' element={<EditCategory />} />
          <Route path='/edit-product/:id' element={<EditProduct />} />
          <Route
            path='/conversations'
            element={<Conversation socket={socket} />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
