import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import Content from '../../common/Content/Content';

import { toVND } from '../../UI/PriceToVN';
import { truncateCenter } from '../../UI/Truncate';

import styles from './Orders.module.css';

function OrdersPage() {
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState();
  const { fetchUrl: fetchData } = useFetch();

  useEffect(() => {
    fetchData(
      {
        url: `/api/orders`,
        headers: {
          Authorization: 'Basic ' + userId,
        },
      },
      data => {
        setOrders(data);
      }
    );
  }, [fetchData, userId]);

  const orderTotal = items => {
    const itemTotal = items.map(item => item.productId.price * item.quantity);
    const initialValue = 0;
    const orderTotal = itemTotal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );

    return toVND(orderTotal);
  };

  const ordersContent = (
    <Row className={`${styles.table} ${styles.italic} ${styles.center}`}>
      <Row className={`${styles.thead}`}>
        <Col className={`${styles.col}`}>ID ORDER</Col>
        <Col className={`${styles.col}`}>ID USER</Col>
        <Col className={`${styles.col}`}>NAME</Col>
        <Col className={`${styles.col}`}>PHONE</Col>
        <Col className={`${styles.col}`}>ADDRESS</Col>
        <Col className={`${styles.col}`}>TOTAL</Col>
        <Col className={`${styles.col}`}>DELIVERY</Col>
        <Col className={`${styles.col}`}>STATUS</Col>
        <Col className={`${styles.col}`}>DETAIL</Col>
      </Row>
      {orders &&
        orders.map(order => (
          <Row className={`${styles.tbody}`} key={order._id}>
            <Col className={`${styles.col}`}>
              <p>{truncateCenter(order._id, 5, '...')}</p>
            </Col>
            <Col className={`${styles.col}`}>
              <p>{truncateCenter(order.user, 5, '...')}</p>
            </Col>
            <Col className={`${styles.col}`}>
              <p>{order.information.fullName}</p>
            </Col>
            <Col className={`${styles.col}`}>
              <p>{order.information.phoneNumber}</p>
            </Col>
            <Col className={`${styles.col}`}>
              <p>{order.information.address}</p>
            </Col>
            <Col className={`${styles.col}`}>
              <p>{orderTotal(order.products)} VND</p>
            </Col>
            <Col className={`${styles.col}`}>
              <p>DELIVERY</p>
            </Col>
            <Col className={`${styles.col}`}>
              <p>STATUS</p>
            </Col>
            <Col className={`${styles.col}`}>
              <Link to={`/order/${order._id}`} className={styles.btn}>
                View <i className='fa-solid fa-arrow-right'></i>
              </Link>
            </Col>
          </Row>
        ))}
    </Row>
  );

  return (
    <Content isShow={true} h4Context='HISTORY' h6Context='HISTORY'>
      {ordersContent}
    </Content>
  );
}

export default OrdersPage;
