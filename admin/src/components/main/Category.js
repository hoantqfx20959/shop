import { useState } from 'react';
import { Link } from 'react-router-dom';

import useData from '../../untils/use-data';

import styles from './Table.module.css';

import Content from '../common/Content/Content';
import Checkbox from '../UI/Checkbox/Checkbox';

function Category() {
  const { category } = useData();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(category && category.map(category => category._id));
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

  const categories = (
    <div className={styles.card}>
      <div className={styles.title}>
        <h3>Properties</h3>
        <div>
          <Link to={`/new-category`} className={`${styles.btn} ${styles.link}`}>
            Add New
          </Link>
        </div>
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
            <th>Title</th>
            <th>Description</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {category &&
            category.map(item => (
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
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <form
                    //  onSubmit={handleSubmit}
                    className={styles.action}>
                    <div>
                      <Link
                        className={`${styles.btn} ${styles.link}`}
                        to={`/edit-category/${item._id}`}>
                        Edit
                      </Link>
                    </div>
                    {/* <div>
                      <button
                        onClick={() => {
                          setcategoryId(item._id);
                        }}
                        className={styles.btn}>
                        Delete
                      </button>
                    </div> */}
                  </form>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return <Content>{categories}</Content>;
}

export default Category;
