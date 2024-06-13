import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import styles from './Table.module.css';
import useFetch from '../../untils/use-fetch';
import { toVND } from '../UI/PriceToVN';
import Image from '../UI/Image/Image';
import Content from '../common/Content/Content';

function OrdersPage() {
  const params = useParams();

  const { fetchUrl: fetchData } = useFetch();

  const [order, setOrder] = useState();

  useEffect(() => {
    fetchData(
      {
        url: `/api/order/${params.id}`,
      },
      data => {
        setOrder(data);
      }
    );
  }, [fetchData, params.id]);

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
    <>
      {order && (
        <>
          <Row className={styles.italic}>
            <h1>INFORMATION ORDER</h1>
            <p>ID User: {order.user}</p>
            <p>Full Name: {order.information.fullName}</p>
            <p>Phone: {order.information.phoneNumber}</p>
            <p>Address: {order.information.address}</p>
            <p>Total: {orderTotal(order.products)} VND</p>
          </Row>
          <Row className={`${styles.table} ${styles.italic} ${styles.center}`}>
            <Row className={`${styles.thead}`}>
              <Col>ID PRODUCT</Col>
              <Col>IMAGE</Col>
              <Col>NAME</Col>
              <Col>PRICE</Col>
              <Col>COUNT</Col>
            </Row>
            {order.products.map(product => (
              <Row className={`${styles.tbody}`} key={product.productId._id}>
                <Col>
                  <p>{product.productId._id}</p>
                </Col>
                <Col>
                  <Image
                    src={product.productId.images[0]}
                    alt={product.title}
                    className={styles.detailImg}
                  />
                </Col>
                <Col>
                  <p>{product.productId.name}</p>
                </Col>
                <Col>
                  <p>{toVND(product.productId.price)} VND</p>
                </Col>
                <Col>
                  <p>{product.quantity}</p>
                </Col>
              </Row>
            ))}
          </Row>
        </>
      )}
    </>
  );

  return <Content>{ordersContent}</Content>;
}

export default OrdersPage;
