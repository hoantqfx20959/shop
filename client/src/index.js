import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';

import App from './App';
import allReducer from './store/reducers/index';

const rootReducer = combineReducers({
  shop: allReducer,
});
const store = createStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.Fragment>
      <App />
    </React.Fragment>
  </Provider>
);
