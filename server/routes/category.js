const express = require('express');
const { check, body } = require('express-validator');

const categoryController = require('../controllers/category');

const router = express.Router();

router.post(
  '/category',
  [
    body('name').trim().isLength({ min: 2 }),
    body('title').trim().isLength({ min: 2, max: 20 }),
    body('description').trim().isLength({ min: 5, max: 500 }),
  ],
  categoryController.postCategory
);

router.get('/categories', categoryController.getCategories);

router.get('/category/:id', categoryController.getCategory);

router.get('/category-by-type', categoryController.getCategoryByType);

router.put(
  '/category/:id',
  [
    body('name').trim().isLength({ min: 2 }),
    body('title').trim().isLength({ min: 2, max: 20 }),
    body('description').trim().isLength({ min: 5, max: 500 }),
  ],
  categoryController.putCategory
);

module.exports = router;
