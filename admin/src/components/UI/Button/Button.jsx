import styles from './Button.module.css';

const Button = props => {
  // style của nút chung + style của nút riêng
  const classes = `${styles.button} ${props.className}`;

  return (
    <button type={props.type} className={classes} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
export default Button;
