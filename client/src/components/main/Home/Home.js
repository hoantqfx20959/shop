import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';
import URL from '../../../untils/url';

import Content from '../../common/Content/Content';

import styles from './Home.module.css';

import DetailPopup from '../../UI/Popup/DetailPopup';

function HomePage() {
  const { fetchUrl: fetchData } = useFetch();

  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();

  useEffect(() => {
    fetchData({ url: `/api/categories` }, data => {
      setCategories(data);
    });
    fetchData({ url: `/api/products` }, data => {
      setProducts(data);
    });
  }, [fetchData]);

  const [isShow, setIsShow] = useState(false);
  const [product, setProduct] = useState();

  const callbackChild = data => {
    setIsShow(data);
  };

  const categoryContent = (
    <Col className={styles.categories}>
      <div className={styles.title}>
        <p>CAREFULLY CREATED COLLECTIONS</p>
        <h4>BROWSE OUR CATEGORIES</h4>
      </div>
      <Row className='m-0'>
        {categories &&
          categories.map((item, index) => {
            if (index < 2) {
              return (
                <Col
                  className={`${styles.itemCategories} col-6 `}
                  key={item._id}>
                  <Link to={`/shop?type=${item.title}`}>
                    <img
                      src={`${URL.LOCAL}/${item.images[0].replace('\\', '/')}`}
                      alt={item.title}
                      className={styles.imgCategories}></img>
                  </Link>
                </Col>
              );
            }
            if (index >= 2) {
              return (
                <Col
                  className={`${styles.itemCategories} col-4`}
                  key={item._id}>
                  <Link to={`/shop?type=${item.title}`}>
                    <img
                      src={`${URL.LOCAL}/${item.images[0].replace('\\', '/')}`}
                      alt={item.title}
                      className={styles.imgCategories}></img>
                  </Link>
                </Col>
              );
            }
            return item;
          })}
      </Row>
    </Col>
  );

  const productContent = (
    <Row className={styles.itemsList}>
      <p>MADE THE HARD WAY</p>
      <h4>TOP TRENDING PRODUCTS</h4>
      {products &&
        products.map(item => (
          <Col key={item._id} className={`${styles.item} col-3 `}>
            <div
              onClick={() => {
                setIsShow(isShow => !isShow);
                setProduct(item);
              }}>
              <img
                src={`${URL.LOCAL}/${item.images[0].replace('\\', '/')}`}
                alt={item.title}></img>
              <h5>{item.name}</h5>
              <p>{item.price} VND</p>
            </div>
          </Col>
        ))}
    </Row>
  );

  return (
    <Content
      isShow={true}
      style={{ backgroundImage: `url('./images/banner1.jpg')` }}
      pContext='NEW INSPIRATION 2020'
      h4Context='20% OFF ON NEW SEASON'
      button={
        <Link to='/shop?mode=all' className={styles.btn}>
          Browse collections
        </Link>
      }>
      {isShow && (
        <DetailPopup product={product} parentCallback={callbackChild} />
      )}
      <Row>{categoryContent}</Row>
      <Row>{productContent}</Row>
    </Content>
  );
}

export default HomePage;
