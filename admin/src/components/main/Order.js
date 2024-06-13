import { useState } from 'react';
import { Link } from 'react-router-dom';
import useData from '../../untils/use-data';
import { truncateCenter } from '../UI/Truncate';
import { toVND } from '../UI/PriceToVN';

import styles from './Table.module.css';

import Content from '../common/Content/Content';
import Checkbox from '../UI/Checkbox/Checkbox';

function Order() {
  const { order } = useData();

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(order && order.map(property => property._id));
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

  const orderTotal = items => {
    const itemTotal = items.map(item => item.productId.price * item.quantity);
    const initialValue = 0;
    const orderTotal = itemTotal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );

    return toVND(orderTotal);
  };

  const orders = (
    <div className={styles.card}>
      <h3>Latest orders</h3>
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
            <th>ID User</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {order &&
            order.map(item => (
              <tr key={item._id}>
                <td>
                  <Checkbox
                    key={item._id}
                    type='checkbox'
                    name={item.userId}
                    id={item._id}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(item._id)}
                  />
                </td>
                <td>{truncateCenter(item.user, 4, '...')}</td>
                <td>{item.information.fullName}</td>
                <td>{item.information.phoneNumber}</td>
                <td>{item.information.address}</td>
                <td>{orderTotal(item.products)} VND</td>
                <td>Delivery</td>
                <td>Status</td>
                <td>
                  <Link to={`/order/${item._id}`} className={styles.btn}>
                    View <i className='fa-solid fa-arrow-right'></i>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return <Content>{orders}</Content>;
}

export default Order;
