import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { generateToast } from '../../UI/Toast/Toast';
import useFetch from '../../../untils/use-fetch';

import Content from '../../common/Content/Content';

import { toVND } from '../../UI/PriceToVN';

import styles from './Checkout.module.css';

function CheckoutPage() {
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const { fetchUrl: fetchData } = useFetch();

  const [user, setUser] = useState();

  useEffect(() => {
    fetchData(
      {
        url: `/api/user`,
        headers: {
          Authorization: 'Basic ' + userId,
        },
      },
      data => {
        setUser(data);
      }
    );
  }, [fetchData, userId]);

  const cart = user && user.cart;

  const itemTotal =
    cart &&
    cart.items &&
    cart.items.map(item => item.productId.price * item.quantity);

  const initialValue = 0;
  const cartTotal =
    itemTotal &&
    itemTotal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await fetchData(
        {
          url: `/api/orders`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
            fullName: event.target.fullName.value,
            email: event.target.email.value,
            phoneNumber: event.target.phoneNumber.value,
            address: event.target.address.value,
          }),
        },
        data => {
          if (data) {
            if (data.errorMessage) {
              generateToast(data.errorMessage);
            } else {
              navigate('/orders');
              window.location.reload();
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const checkoutContent = (
    <>
      <h4 style={{ fontStyle: 'italic' }}>BILLING DETAILS</h4>
      <Row className='m-0'>
        <Col className='col-8'>
          <form className={styles.billingDetails} onSubmit={handleSubmit}>
            <div className={styles.form}>
              <label>FULL NAME:</label>
              <input
                type='text'
                name='fullName'
                defaultValue={user && user.fullName}
                placeholder='Enter Your Full Name Here'></input>
            </div>
            <div className={styles.form}>
              <label>EMAIL:</label>
              <input
                type='email'
                name='email'
                defaultValue={user && user.email}
                placeholder='Enter Your Email Here'></input>
            </div>
            <div className={styles.form}>
              <label>PHONE NUMBER:</label>
              <input
                type='tel'
                name='phoneNumber'
                defaultValue={user && `0${user.phoneNumber}`}
                placeholder='Enter Your Phone Number Here'></input>
            </div>
            <div className={styles.form}>
              <label>ADDRESS:</label>
              <input
                type='text'
                name='address'
                defaultValue={user && user.address}
                placeholder='Enter Your Address Here'></input>
            </div>

            <button className={styles.btn}>Place order</button>
          </form>
        </Col>
        <Col className='col-4'>
          <div className={styles.bill}>
            <h5>YOUR ORDER</h5>
            {cart &&
              cart.items &&
              cart.items.map(item => (
                <Row className={styles.billContent} key={item._id}>
                  <Row className={styles.title}>
                    <div>
                      {item.productId.name}{' '}
                      <span className={styles.titleQuantity}>
                        x {item.quantity}
                      </span>
                    </div>
                  </Row>
                  <Row className={styles.price}>
                    {toVND(item.productId.price * item.quantity)} VND
                  </Row>
                </Row>
              ))}
            <div className={styles.total}>
              <Row className={styles.totalTitle}>TOTAL</Row>
              <Row className={styles.totalPrice}>
                {cartTotal ? `${toVND(cartTotal)} VND` : 0}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );

  return (
    <Content isShow={true} h4Context='CHECKOUT' h6Context='CHECKOUT'>
      {checkoutContent}
    </Content>
  );
}

export default CheckoutPage;
