import { useEffect, useState } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import { Nav, NavItem, Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import styles from './Navbar.module.css';

// định hình cấu trúc navbar
const Navbar = ({ socket }) => {
  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();

  const isLogin = searchParams.get('mode') === 'login';

  const { fetchUrl: fetchData } = useFetch();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    const maxAge = new Date(expiryDate).getTime() - new Date().getTime();

    const setAutoLogout = milliseconds => {
      setTimeout(() => {
        socket.emit('user-setOffline', userId);

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('isClient');
        localStorage.removeItem('isAdviser');
        localStorage.removeItem('isAdmin');

        window.location = '/auth?mode=login';
      }, milliseconds);
    };

    const verifyUser = async () => {
      if (!token) {
      } else {
        setAutoLogout(maxAge);
        await fetchData(
          {
            url: `/check-user`,
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({}),
          },
          data => {
            if (!data.status) {
              socket.emit('user-setOffline', userId);

              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              localStorage.removeItem('username');
              localStorage.removeItem('expiryDate');
              localStorage.removeItem('isClient');
              localStorage.removeItem('isAdviser');
              localStorage.removeItem('isAdmin');
            }
          }
        );
      }
    };
    verifyUser();
  }, [fetchData, socket, userId]);

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (userId)
      fetchData(
        {
          url: `/api/user`,
          headers: {
            Authorization: 'Basic ' + userId,
          },
        },
        data => {
          setCurrentUser(data);
          localStorage.setItem('username', data.username);
          localStorage.setItem('isClient', data.isClient);
          localStorage.setItem('isAdviser', data.isAdviser);
          localStorage.setItem('isAdmin', data.isAdmin);
        }
      );
  }, [fetchData, userId]);

  const logOut = () => {
    socket.emit('user-setOffline', userId);

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('isClient');
    localStorage.removeItem('isAdviser');
    localStorage.removeItem('isAdmin');

    window.location = '/auth?mode=login';
  };

  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

  const btnStyles = `${styles.relative} ${btnIsHighlighted ? styles.bump : ''}`;

  useEffect(() => {
    if (currentUser && currentUser.cart.items.length === 0) {
      return;
    }
    setBtnIsHighlighted(true);
    const timeOut = setTimeout(() => {
      setBtnIsHighlighted(false);
    }, 300);
    return () => {
      clearTimeout(timeOut);
    };
  }, [currentUser]);

  return (
    <Row className={styles.navbar}>
      <Col className='col-4'>
        <Nav className={styles.list}>
          <NavItem>
            <NavLink
              to='/'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
              end>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to='/shop?type=all'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }>
              Shop
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <Col className='col-4 text-center'>
        <h3>BOUTIQUE</h3>
      </Col>
      <Col className='col-4'>
        <Nav className={`${styles.list} ${styles.list2}`}>
          {token && (
            <NavItem className={btnStyles}>
              <NavLink
                to='/cart'
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }>
                <i className='fa-solid fa-cart-shopping'></i>
                <span> Cart</span>
                <span className={styles.cartNumber}>
                  {currentUser &&
                    currentUser.cart.items &&
                    currentUser.cart.items.length}
                </span>
              </NavLink>
            </NavItem>
          )}
          {token && (
            <NavItem className={btnStyles}>
              <NavLink
                to='/orders'
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }>
                <i className='fa-solid fa-basket-shopping'></i>
                <span> Orders</span>
              </NavLink>
            </NavItem>
          )}

          {!token && (
            <NavItem>
              <NavLink
                to={isLogin ? '/auth?mode=register' : '/auth?mode=login'}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }>
                {isLogin ? 'Register' : 'Login'}
              </NavLink>
            </NavItem>
          )}
          {token && (
            <NavItem>
              <i className='fa-solid fa-user'></i>
              <span> {currentUser && currentUser.fullName}</span>
            </NavItem>
          )}
          {token && (
            <NavItem>
              <button className={styles.btn} onClick={logOut}>
                (Logout)
              </button>
            </NavItem>
          )}
        </Nav>
      </Col>
    </Row>
  );
};

export default Navbar;
