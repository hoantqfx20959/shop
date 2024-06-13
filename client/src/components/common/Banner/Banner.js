import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import classes from './Banner.module.css';

// định hình banner
const Banner = ({ props }) => {
  return (
    <Row className={classes.banner} style={props.style}>
      <Col className={classes.title}>
        <p>{props.pContext}</p>
        <h4>{props.h4Context}</h4>
        {props.button}
      </Col>
      <Col className={classes.text}>
        <h6>{props.h6Context}</h6>
      </Col>
    </Row>
  );
};

export default Banner;
