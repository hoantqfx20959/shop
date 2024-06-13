// import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// import { useCookies } from 'react-cookie';
// import axios from '../../../untils/axios';

import styles from './Navbar.module.css';

const AdminNavbar = () => {
  // const [cookies, setCookies, removeCookie] = useCookies([]);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    window.location = '/auth?mode=login';
  };

  const isAdmin = localStorage.isAdmin === 'true';

  return (
    <div className={styles.navbar}>
      {isAdmin && (
        <div>
          <h3>MAIN</h3>
          <ul>
            <NavLink
              to='/'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
              end>
              <i className='fa-solid fa-chart-line'></i> Dashboard
            </NavLink>
          </ul>
        </div>
      )}
      <div>
        <h3>LISTS</h3>
        <ul>
          {isAdmin && (
            <NavLink
              to='/users'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }>
              <i className={'fa-solid fa-user'}></i> Users
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to='/categories'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }>
              <i className='fa-solid fa-list'></i> Categories
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to='/products'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }>
              <i className={'fa-regular fa-hard-drive'}></i> Products
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to='/orders'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }>
              <i className={'fa-solid fa-truck-moving'}></i> Orders
            </NavLink>
          )}
          <NavLink
            to='/conversations'
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }>
            <i className='fa-solid fa-comments'></i> Conversations
          </NavLink>
        </ul>
      </div>
      {isAdmin && (
        <div>
          <h3>NEW</h3>
          <ul>
            <NavLink
              to='/new-category'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }>
              <i className='fa-solid fa-list'></i> New Category
            </NavLink>
            <NavLink
              to='/new-product'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }>
              <i className={'fa-regular fa-hard-drive'}></i> New Product
            </NavLink>
          </ul>
        </div>
      )}
      <div>
        <h3>USER</h3>
        <ul>
          <button onClick={logOut}>
            <i className={'fa-solid fa-arrow-right-from-bracket'}></i> Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default AdminNavbar;
