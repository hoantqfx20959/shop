import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

// định hình backdrop của popup
const BackdropOverlay = props => {
  const styles = `${classes.backdrop} ${props.className}`;

  return <div className={styles} onClick={props.onClose}></div>;
};

const portalElement = document.getElementById('overlays');

const Backdrop = props => {
  const styles = `${props.className}`;

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <BackdropOverlay onClose={props.onClose} className={styles} />,
        portalElement
      )}
    </Fragment>
  );
};

export default Backdrop;
