import { useEffect, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
  useLocation,
  NavLink,
} from 'react-router-dom';
import { Nav, NavItem, Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import styles from './Navbar.module.css';

// định hình cấu trúc navbar
const Navbar = ({ socket }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();

  const isRegister = searchParams.get('mode') === 'register';
  const isResetPass = location.pathname === '/reset-password';
  const isNewPass = location.pathname.includes(`/new-password/`);

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
        if (isRegister || isNewPass || isResetPass) {
          return;
        }
        navigate('/auth?mode=login');
      } else {
        setAutoLogout(maxAge);
        await fetchData(
          {
            url: `/check-admin`,
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

              navigate('/auth?mode=login');
            }
          }
        );
      }
    };
    verifyUser();
  }, [fetchData, isNewPass, isRegister, isResetPass, navigate, socket, userId]);

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
          if (data.isAdviser) {
            navigate('/conversations');
          }
          localStorage.setItem('username', data.username);
          localStorage.setItem('isClient', data.isClient);
          localStorage.setItem('isAdviser', data.isAdviser);
          localStorage.setItem('isAdmin', data.isAdmin);
        }
      );
  }, [fetchData, navigate, userId]);

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

  return (
    <Row className={styles.navbar}>
      <Col className='col-4'></Col>
      <Col className='col-4 text-center'>
        <h3>BOUTIQUE</h3>
      </Col>
      <Col className='col-4'>
        <Nav className={`${styles.list} ${styles.list2}`}>
          {!token && (
            <NavItem>
              <NavLink
                to={isRegister ? '/auth?mode=login' : '/auth?mode=register'}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }>
                {isRegister ? 'Login' : 'Register'}
              </NavLink>
            </NavItem>
          )}
          {token && (
            <NavItem>
              <i className={'fa-solid fa-user'}></i>
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
