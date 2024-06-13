import { Row, Col } from 'reactstrap';

import styles from './Content.module.css';

import Navbar from '../page/Navbar';
import Header from '../page/Header';

const Content = props => {
  // style của nút chung + style của nút riêng
  const classes = `${styles.content} ${props.className} col-9`;
  const isAdmin = localStorage.isAdmin === 'true';

  return (
    <Row>
      <Col className='col-3'>
        <Navbar />
      </Col>
      <Col className={classes}>
        {isAdmin && <Header />}
        {props.children}
      </Col>
    </Row>
  );
};
export default Content;
