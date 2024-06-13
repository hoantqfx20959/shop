import { useEffect, useState } from 'react';

import { Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import Image from '../../UI/Image/Image';
import { toVND } from '../../UI/PriceToVN';

import styles from './Cart.module.css';

function Tbody({ item, parentCallback }) {
  const userId = localStorage.getItem('userId');

  const { fetchUrl: fetchData } = useFetch();

  const [newQuantity, setNewQuantity] = useState(item.quantity);

  useEffect(() => {
    if (item && item.quantity > item.productId.quantity) {
      setNewQuantity(item.productId.quantity);
      try {
        fetchData(
          {
            url: `/api/cart`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.productId._id,
              userId: userId,
              quantity: -item.quantity + item.productId.quantity,
            }),
          },
          data => {}
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, [fetchData, item, userId]);

  const removeHandler = async event => {
    event.preventDefault();
    if (newQuantity > 1) {
      setNewQuantity(newQuantity - 1);
      try {
        await fetchData({
          url: `/api/cart`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.productId._id,
            userId: userId,
            quantity: -1,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    }
    if (newQuantity === 1) {
      setNewQuantity(0);
      try {
        await fetchData(
          {
            url: `/api/cart`,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.productId._id,
              userId: userId,
            }),
          },
          data => {}
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const addHandler = async event => {
    event.preventDefault();
    if (newQuantity < item.productId.quantity) {
      setNewQuantity(newQuantity + 1);
      try {
        await fetchData(
          {
            url: `/api/cart`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.productId._id,
              userId: userId,
              quantity: +1,
            }),
          },
          data => {}
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deleteHandler = async event => {
    event.preventDefault();
    if (newQuantity < item.productId.quantity) {
      setNewQuantity(0);
      try {
        await fetchData(
          {
            url: `/api/cart`,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: item.productId._id,
              userId: userId,
            }),
          },
          data => {}
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    parentCallback({
      id: item.productId._id,
      total: item.productId.price * newQuantity,
    });
  }, [item, newQuantity, parentCallback]);

  return (
    newQuantity !== 0 && (
      <Row className={styles.tbody}>
        <Col className={styles.tbodyImg}>
          <Image
            src={item.productId.images[0]}
            alt={item.productId.category}></Image>
        </Col>
        <Col className={styles.tbodyName}>
          <p>{item.productId.name}</p>
        </Col>
        <Col className={styles.tbodyPrice}>
          <p>{toVND(item.productId.price)} VND</p>
        </Col>

        <Col className={styles.tbodyAction}>
          <button onClick={removeHandler}>
            <i className='fa-solid fa-minus' id={item._id}></i>
          </button>
          <p>{newQuantity}</p>
          <button onClick={addHandler}>
            <i className='fa-solid fa-plus' id={item._id}></i>
          </button>
        </Col>

        <Col className={styles.tbodyTotal}>
          <p>{toVND(item.productId.price * newQuantity)} VND</p>
        </Col>
        <Col className={styles.tbodyDelete}>
          <button onClick={deleteHandler}>
            <i className='fa-solid fa-trash'></i>
          </button>
        </Col>
      </Row>
    )
  );
}
export default Tbody;
