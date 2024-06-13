import { useState } from 'react';
import { truncateCenter } from '../UI/Truncate';

import useData from '../../untils/use-data';

import styles from './Table.module.css';

import Content from '../common/Content/Content';
import Checkbox from '../UI/Checkbox/Checkbox';

function User() {
  const { user } = useData();

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(
      user &&
        user.filter(user => user.isAdmin !== true).map(property => property._id)
    );
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  const users = (
    <div className={styles.card}>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox
                type='checkbox'
                name='selectAll'
                id='selectAll'
                handleClick={handleSelectAll}
                isChecked={isCheckAll}
              />
            </th>
            <th>ID</th>
            <th>User</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {user &&
            user
              .filter(user => user.isAdmin !== true)
              .map(item => (
                <tr key={item._id}>
                  <td>
                    <Checkbox
                      key={item._id}
                      type='checkbox'
                      name={item.username}
                      id={item._id}
                      handleClick={handleClick}
                      isChecked={isCheck.includes(item._id)}
                    />
                  </td>
                  <td>{truncateCenter(item._id, 7, '...')}</td>
                  <td>{item.username}</td>
                  <td>{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );

  return <Content>{users}</Content>;
}

export default User;
