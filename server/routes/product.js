const express = require('express');
const { check, body } = require('express-validator');

const productController = require('../controllers/product');

const router = express.Router();

router.post(
  '/product',
  [
    body('name').trim().isLength({ min: 2 }),
    body('title').trim().isLength({ min: 2, max: 50 }),
    body('shortDescription').trim().isLength({ min: 5, max: 500 }),
    body('longDescription').trim().isLength({ min: 5, max: 5000 }),
    body('quantity').isFloat(),
    body('price').isFloat(),
  ],
  productController.postProduct
);

router.get('/products', productController.getProducts);

router.get('/product/:id', productController.getProduct);

router.get('/products-by-type', productController.getProductsByType);

router.put(
  '/product/:id',
  [
    body('name').trim().isLength({ min: 2 }),
    body('title').trim().isLength({ min: 2, max: 50 }),
    body('shortDescription').trim().isLength({ min: 5, max: 500 }),
    body('longDescription').trim().isLength({ min: 5, max: 5000 }),
    body('quantity').isFloat(),
    body('price').isFloat(),
  ],
  productController.putProduct
);

router.delete('/product', productController.deleteProduct);

module.exports = router;
