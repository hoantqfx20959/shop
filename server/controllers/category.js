const fs = require('fs');
const path = require('path');

const Category = require('../models/category');
const { validationResult } = require('express-validator');
const product = require('../models/product');

exports.postCategory = async (req, res, next) => {
  try {
    const name = req.body.name;
    const title = req.body.title;
    const description = req.body.description;
    const images = [];
    req.files.map((file, i) => {
      images.push(file.path);
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: name,
          title: title,
          description: description,
          images: images,
        },
        validationErrors: errors.array(),
      });
    }

    const category = new Category({
      name: name,
      title: title,
      description: description,
      images: images,
    });

    await category.save();

    console.log('CREATED CATEGORY');
    res.status(201).json('Category saved.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    res.status(200).json(category);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getCategoryByType = async (req, res, next) => {
  try {
    const type = req.query.type;
    const categories = await Category.find().populate({
      path: 'products.productId',
    });
    let categoriesByType;
    if (type === 'all') {
      categoriesByType = categories;
    }
    if (type !== 'all') {
      categoriesByType = categories.filter(category => category.title === type);
    }
    res.status(200).json(categoriesByType);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.putCategory = async (req, res, next) => {
  try {
    const catygoriId = req.params.id;
    const updatedName = req.body.name;
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedImages = [];

    if (req.body.images) {
      if (typeof req.body.images === 'string') {
        updatedImages.push(req.body.images);
      } else {
        req.body.images.map(image => updatedImages.push(image));
      }
    }
    if (req.files) {
      req.files.map(file => updatedImages.push(file.path));
    }
    if (!updatedImages) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: updatedName,
          title: updatedTitle,
          description: updatedDescription,
          images: updatedImages,
        },
        validationErrors: errors.array(),
      });
    }

    const category = await Category.findById(catygoriId);

    let deleteImages = category.images;
    const oldImages = category.images.map(image =>
      image.replace('images\\', '').replace('images/', '')
    );
    const newImages = updatedImages.map(image =>
      image.replace('images\\', '').replace('images/', '')
    );
    let indexImages = newImages.map((img, i) => {
      const indexImage = oldImages.indexOf(img);
      return indexImage;
    });
    indexImages = indexImages
      .filter(indexImage => indexImage >= 0)
      .sort((a, b) => b - a);
    if (indexImages.length > 0) {
      indexImages.map(indexImage => {
        deleteImages.splice(indexImage, 1);
      });
      deleteImages.map(image => clearImage(image));
    } else {
      deleteImages.map(image => clearImage(image));
    }

    category.name = updatedName;
    category.title = updatedTitle;
    category.description = updatedDescription;
    category.images = updatedImages;

    await category.save();

    console.log('UPDATED CATEGORY');
    res.status(201).json('Category updated.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
