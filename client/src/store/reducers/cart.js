// định hình localStorage
class CartItem {
  constructor(email, arr, totalAmount) {
    this.email = email;
    this.arr = arr;
    this.totalAmount = totalAmount;
  }
}

// kế thừa
const parseCartItem = (email, arr, totalAmount) => {
  const cart = new CartItem(email, arr, totalAmount);
  return cart;
};

// lưu vào localStorage
const saveToStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

// lấy từ localStorage
const getFromStorage = key => {
  const store = window.localStorage.getItem(key);
  if (store === null) return undefined;
  return JSON.parse(store);
};

const carts = getFromStorage('cartArr') ? getFromStorage('cartArr') : [];

const cartArr = carts.map(cart =>
  parseCartItem(cart.email, cart.arr, cart.totalAmount)
);

// lấy dữ liệu user
const localUser = getFromStorage('currentUser');

const getItemIndex = action => {
  if (action) {
    const itemIndex = cartArr.findIndex(cart => cart.email === action.email);
    return itemIndex;
  }
};

const getItem = index => {
  const item = cartArr[index];

  return item;
};

const localItemIndex = getItemIndex(localUser);

const localItem = getItem(localItemIndex);

// nhập dữ liệu ban đầu cho reducer
const initialState = {
  products: localItem ? localItem.arr : [],
  totalAmount: localItem ? localItem.totalAmount : 0,
};

// reducer
const cartReducer = (state = initialState, action) => {
  let updateTotalAmount;
  let existingProduct;
  let existingProductIndex;
  let existingCartItem;
  let existingCartItemIndex;
  let existingItem;
  let existingItems;

  const updateArr = (email, arr, totalAmount) => {
    const cart = new CartItem(email, arr, totalAmount);

    // check user
    if (
      existingProduct === undefined ||
      (existingProduct !== undefined && existingProduct.email !== email)
    ) {
      cartArr.push(cart);
      saveToStorage('cartArr', cartArr);
    } else {
      cartArr.splice(existingProductIndex, 1);
      cartArr.push(cart);
      saveToStorage('cartArr', cartArr);
    }
  };

  // action
  switch (action.type) {
    case 'ADD':
      if (action.item) {
        existingProductIndex = getItemIndex(action);
        existingProduct = getItem(existingProductIndex);

        updateTotalAmount =
          state.totalAmount + action.item.price * action.item.amount;

        existingCartItemIndex = state.products.findIndex(
          i => i.id === action.item.id
        );

        existingCartItem = state.products[existingCartItemIndex];

        if (existingCartItem) {
          existingItem = {
            ...existingCartItem,
            amount: existingCartItem.amount + action.item.amount,
          };
          existingItems = [...state.products];
          existingItems[existingCartItemIndex] = existingItem;
          updateArr(action.email, existingItems, updateTotalAmount);
        } else {
          existingItems = state.products.concat(action.item);
          updateArr(action.email, existingItems, updateTotalAmount);
        }
        return {
          products: existingItems,
          totalAmount: updateTotalAmount,
        };
      }
      return;
    case 'REMOVE':
      existingProductIndex = getItemIndex(action);
      existingProduct = getItem(existingProductIndex);

      existingCartItemIndex = state.products.findIndex(
        i => i.id === action.item.id
      );

      existingCartItem = state.products[existingCartItemIndex];

      updateTotalAmount = state.totalAmount - existingCartItem.price;

      if (existingCartItem.amount === 1) {
        state.products.splice(existingCartItemIndex, 1);
        existingItems = [...state.products];
        updateArr(action.email, existingItems, updateTotalAmount);
      } else {
        existingItem = {
          ...existingCartItem,
          amount: existingCartItem.amount - 1,
        };
        existingItems = [...state.products];
        existingItems[existingCartItemIndex] = existingItem;
        updateArr(action.email, existingItems, updateTotalAmount);
      }

      return {
        products: existingItems,
        totalAmount: updateTotalAmount,
      };

    case 'DELETE':
      existingProductIndex = getItemIndex(action);
      existingProduct = getItem(existingProductIndex);

      updateTotalAmount =
        state.totalAmount - action.item.price * action.item.amount;

      existingCartItemIndex = state.products.findIndex(
        i => i.id === action.item.id
      );
      state.products.splice(existingCartItemIndex, 1);
      existingItems = [...state.products];
      updateArr(action.email, existingItems, updateTotalAmount);

      return {
        products: existingItems,
        totalAmount: updateTotalAmount,
      };

    default:
      return state;
  }
};

export default cartReducer;
