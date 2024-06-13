import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { generateToast, ToastContent } from '../../UI/Toast/Toast';
import useFetch from '../../../untils/use-fetch';
import URL from '../../../untils/url';

import Content from '../../common/Content/Content';
import Image from '../../UI/Image/Image';
import { toVND } from '../../UI/PriceToVN';

import styles from './Detail.module.css';

function DetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const { fetchUrl: fetchData } = useFetch();

  const [product, setProduct] = useState();
  const [products, setProducts] = useState();

  useEffect(() => {
    if (params) {
      fetchData({ url: `/api/product/${params.id}` }, data => {
        setProduct(data);
      });
      fetchData({ url: `/api/products` }, data => {
        setProducts(data);
      });
    }
  }, [fetchData, params]);

  const relatedProducts =
    product && products && products.filter(item => item.type === product.type);

  // click image bên trái sẽ phóng to ở bên phải
  const [imgHandler, setImgHandler] = useState();
  const imgActionHandler = event => {
    event.preventDefault();
    setImgHandler(event.target.src.replace(`${URL.LOCAL}/`, ''));
  };

  const [quantity, setQuantity] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    if (!token) {
      const check = window.confirm('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      if (check) {
        navigate('/auth?mode=login');
      } else {
        navigate(`/detail/${params.id}`, { replace: true });
      }
    } else {
      try {
        await fetchData(
          {
            url: `/api/cart`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: product._id,
              userId: userId,
              quantity: quantity,
            }),
          },
          data => {
            if (data) {
              if (data.errorMessage) {
                generateToast(data.errorMessage);
              } else {
                window.location = '/cart';
              }
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const [description, setDescription] = useState(false);

  const detailContent = product && (
    <Row className={styles.detail}>
      <Row className={styles.content}>
        <Col className='col-6 d-flex'>
          <Col className='col-2'>
            {product.images.map(image => (
              <Image
                key={image}
                src={image}
                alt={product.title}
                className={styles.imgList}
                onClick={imgActionHandler}
              />
            ))}
          </Col>
          <Col className='col-10'>
            <Image
              src={imgHandler ? imgHandler : product.images[0]}
              alt={product.category}
              className={styles.imgHandler}></Image>
          </Col>
        </Col>
        <Col>
          <h4>{product.name}</h4>
          <p>{toVND(product.price)}</p>
          <p>{product.shortDescription}</p>
          <p>
            <strong style={{ color: 'var(--color-gray-800)' }}>
              CATEGORY:
            </strong>
            {` ${product.type}`}
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type='number'
              name='quantity'
              min={1}
              max={product.quantity}
              placeholder='Quantity'
              onChange={e => setQuantity(e.target.value)}
              defaultValue={quantity}
            />
            <button>Add to cart</button>
          </form>
        </Col>
      </Row>
      <Row className={styles.description}>
        <button
          onClick={() => {
            setDescription(!description);
          }}>
          DESCRIPTION
        </button>
        {description && (
          <>
            <h5>PRODUCT DESCRIPTION</h5>
            <p style={{ whiteSpace: 'pre-wrap' }}>{product.longDescription}</p>
          </>
        )}
      </Row>
      <Row>
        <h5>RELATED PRODUCTS</h5>
        <Row className={styles['items-list']}>
          {relatedProducts &&
            relatedProducts.map(item => (
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
      </Row>

      <ToastContent />
    </Row>
  );
  return <Content>{detailContent}</Content>;
}

export default DetailPage;
