import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

// định hình modal của popup
const ModalOverlay = props => {
  const styles = `${classes.modal} ${props.className}`;

  return <div className={styles}>{props.children}</div>;
};

const portalElement = document.getElementById('overlays');

const Modal = props => {
  const styles = `${props.className}`;

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ModalOverlay className={styles}>
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
