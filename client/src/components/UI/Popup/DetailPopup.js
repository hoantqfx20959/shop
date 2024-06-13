import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toVND } from '../PriceToVN';
import Image from '../Image/Image';

import classes from './Popup.module.css';

import Modal from '../Modal/Modal';
import Backdrop from '../Modal/Backdrop';

// định hình popup chi tiết product
const DetailPopup = ({ product, parentCallback }) => {
  const modalActions = () => {
    parentCallback(false);
  };

  return (
    <>
      <Backdrop onClose={modalActions} className={classes.backdrop} />
      <Modal className={classes.modal}>
        <Container>
          <Row className={classes.content}>
            <Col className={classes.img}>
              <Image src={product.images[0]} alt={product.title} />
            </Col>
            <Col className={classes.title}>
              <h3>{product.name}</h3>
              <p>{toVND(product.price)} VDN</p>
              <p>{product.shortDescription}</p>
              <Link to={`/detail/${product._id}`} onClick={modalActions}>
                <i className='fa-solid fa-cart-shopping'></i>
                <span> View Detail</span>
              </Link>
            </Col>
            <button onClick={modalActions} className={classes.close}>
              x
            </button>
          </Row>
        </Container>
      </Modal>
    </>
  );
};

export default DetailPopup;
