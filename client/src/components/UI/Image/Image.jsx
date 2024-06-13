import styles from './Image.module.css';
import URL from '../../../untils/url';

const Image = props => {
  // style của nút chung + style của nút riêng
  const classes = `${styles.image} ${props.className}`;

  return (
    <img
      className={classes}
      src={`${URL.LOCAL}/${props.src.replace('\\', '/')}`}
      alt={props.alt}
      onClick={props.onClick}
    />
  );
};
export default Image;
