import styles from './PageContent.module.css';

const PageContent = props => {
  // style của nút chung + style của nút riêng
  const classes = `${styles.pageContent} ${props.className}`;

  return <div className={classes}>{props.children}</div>;
};
export default PageContent;
