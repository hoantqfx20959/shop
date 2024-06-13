import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { ToastContent, generateToast } from '../../UI/Toast/Toast';
import useFetch from '../../../untils/use-fetch';

import styles from './Form.module.css';

import Content from '../../common/Content/Content';
import Button from '../../UI/Button/Button';
import ImageInput from './InputImage';

const AdminCategoryForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { fetchUrl: fetchData } = useFetch();

  const [editCategory, setEditCategory] = useState();

  const [name, setName] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState();

  useEffect(() => {
    if (params.id) {
      fetchData({ url: `/api/category/${params.id}` }, data => {
        setEditCategory(data);
      });
    }
  }, [fetchData, params.id]);
  const callbackChild = data => {
    setPhotos(data);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name || (editCategory && editCategory.name));
      formData.append(
        'title',
        title.toLowerCase() || (editCategory && editCategory.title)
      );
      formData.append(
        'description',
        description || (editCategory && editCategory.description)
      );
      photos.forEach((image, index) => {
        formData.append(
          `images`,
          image || (editCategory && editCategory.images)
        );
      });

      await fetchData(
        {
          url: `/api/${editCategory ? `category/${params.id}` : 'category'}`,
          method: editCategory ? 'PUT' : 'POST',
          headers: {},
          body: formData,
        },
        data => {
          if (data) {
            if (data.errorMessage) {
              generateToast(data.errorMessage);
            } else {
              navigate('/categories');
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
      <form className={styles.form} onSubmit={handleSubmit}>
        <Row className={styles.formRow}>
          <Col className={`${styles.formCol} col-6`}>
            <div className={styles.formColItem}>
              <label>Name</label>
              <input
                type='text'
                name='name'
                placeholder='Name'
                onChange={e => setName(e.target.value)}
                defaultValue={editCategory ? editCategory.name : ''}
              />
            </div>
            <div className={styles.formColItem}>
              <label>Description</label>
              <input
                type='text'
                name='description'
                // rows='5'
                placeholder='Description'
                onChange={e => setDescription(e.target.value)}
                defaultValue={editCategory ? editCategory.description : ''}
              />
            </div>
          </Col>
          <Col className={`${styles.formCol} col-6`}>
            <div className={styles.formColItem}>
              <label>Title</label>
              <input
                type='text'
                name='title'
                placeholder='Title'
                onChange={e => setTitle(e.target.value)}
                defaultValue={editCategory ? editCategory.title : ''}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <ImageInput editItem={editCategory} parentCallback={callbackChild} />
        </Row>

        <div className={styles.formAction}>
          <Button>Save</Button>
        </div>
      </form>
      <ToastContent />
    </Content>
  );
};

export default AdminCategoryForm;
