import { Row, Col } from 'reactstrap';

import styles from './Content.module.css';

import Banner from '../Banner/Banner';
import Information from '../Information/Information';
import Footer from '../Footer/Footer';

const Content = props => {
  // style của nút chung + style của nút riêng
  const classes = `${styles.content} ${props.className}`;

  return (
    <Row className={classes.col}>
      <Col className={classes.col}>
        {props.isShow && <Banner props={props} />}
        {props.children}
        {props.isShow && <Information />}
        {props.isShow && <Footer />}
      </Col>
    </Row>
  );
};
export default Content;
