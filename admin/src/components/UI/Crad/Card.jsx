import styles from './Card.module.css';

const Card = props => {
  // style của thẻ chung + style của thẻ riêng
  const classes = `${styles.card} ${props.className}`;

  return <div className={classes}>{props.children}</div>;
};

export default Card;
