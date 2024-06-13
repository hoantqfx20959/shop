import URL from '../../../untils/url';

import styles from './Image.module.css';

const Image = props => {
  // style của nút chung + style của nút riêng
  const classes = `${styles.image} ${props.className}`;

  return (
    <img
      className={classes}
      src={`${URL.LOCAL}/${props.src.replace('\\', '/')}`}
      alt={props.alt}
    />
  );
};
export default Image;
