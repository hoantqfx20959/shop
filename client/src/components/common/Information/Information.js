import { Col, Row } from 'reactstrap';

import classes from './Information.module.css';

// định hình information trong home
const Information = () => {
  return (
    <Row>
      <Col>
        <Row className={classes.title}>
          <Col>
            <h4>FREE SHIPPING</h4>
            <p>Free shipping worlwide</p>
          </Col>
          <Col>
            <h4>24 X 7 SERVICE</h4>
            <p>Free shipping worlwide</p>
          </Col>
          <Col>
            <h4>FESTIVAL OFFER</h4>
            <p>Free shipping worlwide</p>
          </Col>
        </Row>
        <Row className={classes.action}>
          <Col className={classes.actionTitle}>
            <h4>LET'S BE FRIENDS!</h4>
            <p>Nisi nisi tempor consequat labaris nisi.</p>
          </Col>
          <Col className={classes.actionSubscribe}>
            <input
              id='email'
              type='email'
              name='email'
              placeholder='Enter your email address'
            />
            <button>Subscribe</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Information;
