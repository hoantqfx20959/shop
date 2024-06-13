import { useEffect, useState } from 'react';
import { Link, NavLink, useSearchParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import useFetch from '../../../untils/use-fetch';

import Content from '../../common/Content/Content';
import Image from '../../UI/Image/Image';
import { toVND } from '../../UI/PriceToVN';

import styles from './Shop.module.css';

function ShopPage() {
  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();
  const { fetchUrl: fetchData } = useFetch();

  const [products, setProducts] = useState();

  const type = searchParams.get('type');

  useEffect(() => {
    fetchData({ url: `/api/products` }, data => {
      setProducts(data);
    });
  }, [fetchData]);

  const [productsByType, setProductsByType] = useState();

  // phân loại product theo category
  useEffect(() => {
    if (products) {
      if (type === 'all') {
        setProductsByType(products);
      }

      if (type !== 'all') {
        const arr = products.filter(item => {
          return item.type === type;
        });
        setProductsByType(arr);
      }
    }
  }, [products, type]);

  const productContent = (
    <Row className={styles['items-list']}>
      {productsByType &&
        productsByType.map(item => (
          <Col
            key={item._id}
            className={`${styles.listProduct} col-xl-4 col-lg-6`}>
            <Link to={`/detail/${item._id}`}>
              <div className={styles.itemProduct}>
                <Image src={item.images[0]} alt={item.title}></Image>
                <h5>{item.name}</h5>
                <p>{toVND(item.price)} VND</p>
              </div>
            </Link>
          </Col>
        ))}
    </Row>
  );

  let content = { productContent };

  content =
    productsByType && productsByType.length > 0 ? (
      productContent
    ) : (
      <h2>No items found.</h2>
    );

  // chia trang hiện thị
  const total =
    productsByType && productsByType.length
      ? Math.floor(productsByType.length / 9 + 1)
      : 0;

  const [currentIndex, setCurrentIndex] = useState(1);

  const handlePrevClick = () => {
    if (currentIndex > 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < total) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const changeNumber = event => {
    setCurrentIndex(event.target.value);
  };

  const categoryContent = (
    <Row className={styles.categories}>
      <Row className={styles.title}>
        <Col className='col-2'>
          <h5>CATEGORIES</h5>
        </Col>
        <Col className='col-8'>
          <form>
            <input
              id='search'
              type='search'
              name='search'
              placeholder='Enter Search Here'></input>
          </form>
        </Col>
        <Col className='col-2 text-end'>
          <select>
            <option>Default sorting</option>
            <option>Default sorting</option>
            <option>Default sorting</option>
            <option>Default sorting</option>
          </select>
        </Col>
      </Row>
      <Row className={styles.products}>
        <Col className={`${styles.list} col-2`}>
          <div>
            <h6 className={styles.apple}>APPLE</h6>
            <NavLink to='?type=all'>All</NavLink>
          </div>

          <div className={styles.listDiv}>
            <h6>IPHONE & MAC</h6>
            <NavLink to='?type=iphone'>iPhone</NavLink>
            <NavLink to='?type=ipad'>iPad</NavLink>
            <NavLink to='?type=mac'>Macbook</NavLink>
          </div>

          <div className={styles.listDiv}>
            <h6>WIRELESS</h6>
            <NavLink to='?type=airpods'>Airpods</NavLink>
            <NavLink to='?type=watch'>Watch</NavLink>
          </div>

          <div className={styles.listDiv}>
            <h6>OTHER</h6>
            <NavLink to='?type=mouse'>Mouse</NavLink>
            <NavLink to='?type=keyboard'>Keyboard</NavLink>
            <NavLink to='?type=other'>Other</NavLink>
          </div>
        </Col>
        <Col className='col-10'>
          {content}
          <div className={styles.actionGroup}>
            <button onClick={handlePrevClick} className={styles.btn}>
              <i className='fa-solid fa-backward'></i>
            </button>
            {total > 0 && (
              <input
                type='number'
                name='number'
                min={'1'}
                max={total}
                onChange={changeNumber}
                value={currentIndex}
                required
              />
            )}
            <button onClick={handleNextClick} className={styles.btn}>
              <i className='fa-solid fa-forward'></i>
            </button>
          </div>
        </Col>
      </Row>
    </Row>
  );

  return (
    <Content isShow={true} h4Context='SHOP' h6Context='SHOP'>
      {categoryContent}
    </Content>
  );
}

export default ShopPage;
