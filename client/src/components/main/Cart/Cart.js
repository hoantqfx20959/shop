import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import Content from '../../common/Content/Content';

import { toVND } from '../../UI/PriceToVN';

import styles from './Cart.module.css';
import Tbody from './Tbody';

function CartPage() {
  const userId = localStorage.getItem('userId');

  const { fetchUrl: fetchData } = useFetch();

  const [cart, setCart] = useState();

  useEffect(() => {
    fetchData(
      {
        url: `/api/cart`,
        headers: {
          Authorization: 'Basic ' + userId,
        },
      },
      data => {
        setCart(data);
      }
    );
  }, [fetchData, userId]);

  const [newItemOfCart, setNewItemOfCart] = useState();
  const callbackChild = useCallback(data => {
    setNewItemOfCart(data);
  }, []);

  const [cartArr, setCartArr] = useState([]);

  useEffect(() => {
    if (newItemOfCart && cart) {
      const itemArr = cart.items.map(cartArr => {
        return {
          id: cartArr.productId._id,
          total: cartArr.productId.price * cartArr.quantity,
        };
      });
      const index = itemArr.map(item => item.id).indexOf(newItemOfCart.id);
      if (index < 0) {
        itemArr.push(newItemOfCart);
      } else {
        itemArr[index].total = newItemOfCart.total;
      }
      setCartArr(itemArr);
    }
  }, [cart, newItemOfCart]);

  const initialValue = 0;
  const cartTotal =
    cartArr &&
    cartArr
      .map(item => item.total)
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue
      );

  const cartContent = (
    <>
      <Row className={styles.main}>
        <Col className={`${styles.list} col-8`}>
          <Row className={styles.title}>
            <Col className={styles.titleText}>IMAGE</Col>
            <Col className={styles.titleText}>PRODUCT</Col>
            <Col className={styles.titleText}>PRICE</Col>
            <Col className={styles.titleText}>QUANTITY</Col>
            <Col className={styles.titleText}>TOTAL</Col>
            <Col className={styles.titleText}>REMOVE</Col>
          </Row>
          {cart &&
            cart.items &&
            cart.items.map(item => {
              return (
                <Tbody
                  key={item._id}
                  item={item}
                  parentCallback={callbackChild}
                />
              );
            })}
        </Col>
        <Col className={`${styles.cartTotal} col-4`}>
          <div className={styles.cartTotal1}>
            <h5>CART TOTAL</h5>
            <Row className={styles.subTotal}>
              <Col className='col-4 d-flex align-items-center'>
                <h6>SUBTOTAL</h6>
              </Col>
              <Col className='col-8 d-flex align-items-center justify-content-end'>
                <p>{cartTotal ? toVND(cartTotal) : 0} VND</p>
              </Col>
            </Row>
            <Row>
              <Col className='col-4 d-flex align-items-center'>
                <h6>TOTAL</h6>
              </Col>
              <Col className='col-8 d-flex align-items-center justify-content-end'>
                <p className={styles.total}>
                  {cartTotal ? toVND(cartTotal) : 0} VND
                </p>
              </Col>
            </Row>
            <Row className={styles.action}>
              <form>
                <input
                  label='Email'
                  id='email'
                  type='email'
                  name='email'
                  placeholder='Email your coupon'></input>
                <button>
                  <i className='fa-solid fa-gift'></i> Apply coupon
                </button>
              </form>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className='m-0 p-0'>
        <Col className='col-8'>
          <Row className={styles.list}>
            <Col>
              <i className='fa-solid fa-arrow-left'></i>{' '}
              <Link to='/shop?type=all'>Continue shopping</Link>
            </Col>
            <Col className={styles.checkout}>
              <span>
                <Link to='/checkout'>Proceed to checkuot</Link>{' '}
                <i className='fa-solid fa-arrow-right'></i>
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );

  return (
    <Content isShow={true} h4Context='CART' h6Context='CART'>
      {cartContent}
    </Content>
  );
}

export default CartPage;
