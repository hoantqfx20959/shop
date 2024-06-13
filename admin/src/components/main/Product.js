import { useState } from 'react';
import { Link } from 'react-router-dom';
import { truncateCenter, truncateStart } from '../UI/Truncate';
import { toVND } from '../UI/PriceToVN';

import useData from '../../untils/use-data';

import styles from './Table.module.css';

import Content from '../common/Content/Content';
import Checkbox from '../UI/Checkbox/Checkbox';
import useFetch from '../../untils/use-fetch';
import Image from '../UI/Image/Image';

function Product() {
  const { product } = useData();

  const [productId, setproductId] = useState();

  const { fetchUrl: fetchData } = useFetch();

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('productId', productId);
      const productElement = document.getElementById(`${productId}`);

      fetchData(
        {
          url: `/api/product/`,
          method: 'DELETE',
          body: formData,
        },
        data => {}
      );

      productElement.parentNode.removeChild(productElement);
    } catch (err) {
      console.log(err);
    }
  };

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(product && product.map(property => property._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  const products = (
    <div className={styles.card}>
      <div className={styles.title}>
        <h3>products</h3>
        <Link to={`/new-product`} className={`${styles.btn} ${styles.link}`}>
          Add New
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox
                type='checkbox'
                name='selectAll'
                id='selectAll'
                handleClick={handleSelectAll}
                isChecked={isCheckAll}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Category</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {product &&
            product.map(item => (
              <tr key={item._id} id={item._id}>
                <td>
                  <Checkbox
                    key={item._id}
                    type='checkbox'
                    name={item.name}
                    id={item._id}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(item._id)}
                  />
                </td>
                <td>{truncateCenter(item._id, 7, '...')}</td>
                <td>{truncateStart(item.name, 15, '...')}</td>
                <td>{toVND(item.price)} VND</td>
                <td>{item.quantity}</td>
                <td>
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    className={styles.img}
                  />
                </td>
                <td>{item.type}</td>
                <td>
                  <form onSubmit={handleSubmit} className={styles.action}>
                    <div>
                      <Link
                        className={styles.btn}
                        to={`/edit-product/${item._id}`}>
                        Edit
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setproductId(item._id);
                        }}
                        className={styles.btn}>
                        Delete
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return <Content>{products}</Content>;
}

export default Product;
