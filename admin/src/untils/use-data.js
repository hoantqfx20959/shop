import { useEffect, useState } from 'react';

import useFetch from './use-fetch';

const useData = () => {
  const [user, setUser] = useState();
  const [category, setCategory] = useState();
  const [product, setProduct] = useState();
  const [order, setOrder] = useState();

  const { fetchUrl: fetchData } = useFetch();

  useEffect(() => {
    fetchData({ url: '/admin/users' }, data => {
      setUser(data);
    });
    fetchData({ url: '/api/categories' }, data => {
      setCategory(data);
    });
    fetchData({ url: '/api/products' }, data => {
      setProduct(data);
    });
    fetchData({ url: '/admin/orders' }, data => {
      setOrder(data);
    });
  }, [fetchData]);

  return { user, category, product, order };
};

export default useData;
