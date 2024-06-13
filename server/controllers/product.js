const fs = require('fs');
const path = require('path');

const Category = require('../models/category');
const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.postProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const longDescription = req.body.longDescription;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const categoryId = req.body.category;
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
          shortDescription: shortDescription,
          longDescription: longDescription,
          quantity: quantity,
          price: price,
          category: categoryId,
          images: images,
        },
        validationErrors: errors.array(),
      });
    }

    const category = await Category.findById(categoryId);

    const product = new Product({
      name: name,
      title: title,
      type: category.title,
      shortDescription: shortDescription,
      longDescription: longDescription,
      quantity: quantity,
      price: price,
      images: images,
    });

    await product.save();

    await Category.findByIdAndUpdate(categoryId, {
      $push: { products: { productId: product._id } },
    });

    console.log('CREATED PRODUCT');
    res.status(201).json('Product saved.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const product = await Product.findById(prodId);
    res.status(200).json(product);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getProductsByType = async (req, res, next) => {
  try {
    const type = req.query.type;
    const products = await Product.find();
    let productsByType;
    if (type === 'all') {
      productsByType = products;
    }
    if (type !== 'all') {
      productsByType = products.filter(product => product.type === type);
    }
    res.status(200).json(productsByType);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.putProduct = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const updatedName = req.body.name;
    const updatedTitle = req.body.title;
    const updatedShortDesc = req.body.shortDescription;
    const updatedLongDesc = req.body.longDescription;
    const updatedQuantity = req.body.quantity;
    const updatedPrice = req.body.price;
    const updatedCategoryId = req.body.category;
    const oldCategoryId = req.body.categoryOld;
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
          shortDescription: updatedShortDesc,
          longDescription: updatedLongDesc,
          quantity: updatedQuantity,
          price: updatedPrice,
          category: updatedCategoryId,
          categoryOld: oldCategoryId,
          images: updatedImages,
        },
        validationErrors: errors.array(),
      });
    }

    const product = await Product.findById(prodId);

    let deleteImages = product.images;
    const oldImages = product.images.map(image =>
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

    const updatedCategory = await Category.findById(updatedCategoryId);

    product.name = updatedName;
    product.title = updatedTitle;
    product.type = updatedCategory.title;
    product.shortDescription = updatedShortDesc;
    product.longDescription = updatedLongDesc;
    product.quantity = updatedQuantity;
    product.price = updatedPrice;
    product.images = updatedImages;

    await product.save();

    await Category.findByIdAndUpdate(oldCategoryId, {
      $pull: { products: { productId: product._id } },
    });

    await Category.findByIdAndUpdate(updatedCategoryId, {
      $push: { products: { productId: product._id } },
    });

    console.log('UPDATED PRODUCT');
    res.status(201).json('Product updated.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId);

    product.images.map(image => clearImage(image));
    await Product.findByIdAndDelete(prodId);

    console.log('DESTROYED PRODUCT');
    res.status(200).json('Product has been deleted.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
