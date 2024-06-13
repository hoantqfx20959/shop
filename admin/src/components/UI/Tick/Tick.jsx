import styles from './Tick.module.css';

const Tick = props => {
  // style của đánh dấu chung + style của đánh dấu riêng
  const classes = `${styles.tick} ${props.className}`;

  return <button className={classes}>{props.children}</button>;
};

export default Tick;
