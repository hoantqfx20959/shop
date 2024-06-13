const express = require('express');
const { check, body } = require('express-validator');

const orderController = require('../controllers/order');

const router = express.Router();

router.post('/cart', [body('quantity').isFloat()], orderController.postCart);

router.get('/cart', orderController.getCart);

router.delete('/cart', orderController.deleteProductInCart);

router.post(
  '/orders',
  [
    body('fullName', 'Please enter a valid Full Name.').exists(),
    body('email', 'Please enter a valid E-Mail.').isEmail(),
    body('phoneNumber', 'Please enter a valid Phone Number.').isMobilePhone(),
    body('address', 'Please enter a valid Address.').exists(),
  ],
  orderController.postOrder
);

router.get('/orders', orderController.getOrders);

router.get('/order/:id', orderController.getOrder);

module.exports = router;
