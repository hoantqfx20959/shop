export const cart = (type, email, item) => {
  return {
    type: type,
    email: email,
    item: item,
    totalAmount: 0,
  };
};
