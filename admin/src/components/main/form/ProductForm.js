import { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContent, generateToast } from '../../UI/Toast/Toast';
import useFetch from '../../../untils/use-fetch';

import styles from './Form.module.css';

import Content from '../../common/Content/Content';
import ImageInput from './InputImage';
import Button from '../../UI/Button/Button';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { fetchUrl: fetchData } = useFetch();

  const [categoryList, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchData({ url: `/api/categories` }, data => {
      setCategories(data);
    });

    if (params.id) {
      fetchData({ url: `/api/product/${params.id}` }, data => {
        setEditProduct(data);
      });
    }
  }, [fetchData, params.id]);

  let categoryEditProduct;

  if (editProduct) {
    categoryEditProduct = categoryList.filter(category =>
      category.products.some(product => product.productId === editProduct._id)
    );
  }

  const typeCategory = [{ value: '', label: 'Select Category' }];

  categoryList.map(category =>
    typeCategory.push({ value: category._id, label: category.name })
  );

  const callbackChild = data => {
    setPhotos(data);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name || (editProduct && editProduct.name));
      formData.append(
        'title',
        title.toLowerCase() || (editProduct && editProduct.title)
      );
      formData.append(
        'shortDescription',
        shortDescription || (editProduct && editProduct.shortDescription)
      );
      formData.append(
        'longDescription',
        longDescription || (editProduct && editProduct.longDescription)
      );
      formData.append(
        'quantity',
        quantity || (editProduct && editProduct.quantity)
      );
      formData.append('price', price || (editProduct && editProduct.price));
      photos.forEach((image, index) => {
        formData.append(`images`, image || (editProduct && editProduct.images));
      });
      formData.append(
        'category',
        category ||
          (editProduct &&
            categoryEditProduct.length > 0 &&
            categoryEditProduct[0]._id)
      );
      if (editProduct) {
        formData.append(
          'categoryOld',
          editProduct &&
            categoryEditProduct.length > 0 &&
            categoryEditProduct[0]._id
        );
      }

      await fetchData(
        {
          url: `/api/${editProduct ? `product/${params.id}` : 'product'}`,
          method: editProduct ? 'PUT' : 'POST',
          headers: {},
          body: formData,
        },
        data => {
          if (data) {
            if (data.errorMessage) {
              console.log(data);
              generateToast(data.errorMessage);
            } else {
              navigate('/products');
            }
          }
        }
      );
    } catch (err) {
      console.log(err);
      generateToast(err.response.data.errorMessage);
    }
  };

  return (
    <Content>
      <form onSubmit={handleSubmit}>
        <Row className={styles.formRow}>
          <Col className={styles.formCol}>
            <div className={styles.formColItem}>
              <label>Name</label>
              <input
                type='text'
                name='name'
                placeholder='Name'
                onChange={e => setName(e.target.value)}
                defaultValue={editProduct ? editProduct.name : ''}
              />
            </div>
            <div className={styles.formColItem}>
              <label>Short Description</label>
              <input
                type='text'
                name='shortDescription'
                placeholder='Short Description'
                onChange={e => setShortDescription(e.target.value)}
                defaultValue={editProduct ? editProduct.shortDescription : ''}
              />
            </div>
            <div className={styles.formColItem}>
              <label>Quantity</label>
              <input
                type='number'
                name='quantity'
                min={1}
                placeholder='Quantity'
                onChange={e => setQuantity(e.target.value)}
                defaultValue={editProduct ? editProduct.quantity : ''}
              />
            </div>
            <div className={styles.formColItem}>
              <label>Choose a categoty</label>
              {/* {editProduct ? (
                categoryEditProduct.length > 0 && (
                  <select
                    name='category'
                    onChange={e => setCategory(categoryEditProduct[0]._id)}>
                    <option value={categoryEditProduct[0]._id}>
                      {categoryEditProduct[0].name}
                    </option>
                  </select>
                )
              ) : ( */}
              <select
                name='category'
                onChange={e => setCategory(e.target.value)}>
                {typeCategory.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* )} */}
            </div>
          </Col>
          <Col className={styles.formCol}>
            <div className={styles.formColItem}>
              <label>Title</label>
              <input
                type='text'
                name='title'
                placeholder='Title'
                onChange={e => setTitle(e.target.value)}
                defaultValue={editProduct ? editProduct.title : ''}
              />
            </div>
            <div className={styles.formColItem}>
              <label>Long Description</label>
              <input
                type='text'
                name='longDescription'
                placeholder='Long Description'
                onChange={e => setLongDescription(e.target.value)}
                defaultValue={editProduct ? editProduct.longDescription : ''}
              />
            </div>
            <div className={styles.formColItem}>
              <label>Price</label>
              <input
                type='number'
                name='price'
                placeholder='Price'
                onChange={e => setPrice(e.target.value)}
                defaultValue={editProduct ? editProduct.price : ''}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <ImageInput editItem={editProduct} parentCallback={callbackChild} />
        </Row>

        <div className={styles.formAction}>
          <Button>Save</Button>
        </div>
      </form>
      <ToastContent />
    </Content>
  );
};

export default AdminProductForm;
