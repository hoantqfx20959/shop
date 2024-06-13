import { combineReducers } from '@reduxjs/toolkit';

import cart from './cart';

const allReducers = combineReducers({
  cart: cart,
});

export default allReducers;
