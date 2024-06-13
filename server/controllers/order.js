const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const io = require('../socket');

const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/auth');

const { SENDMAIL, HTML_TEMPLATE } = require('../mail/mailer.js');
const transporter = ({
  to: mail,
  subject: subjectText,
  message: messageText,
}) => {
  SENDMAIL(
    {
      from: 'SHOP <admin@shop.com>',
      to: mail,
      subject: subjectText,
      text: messageText,
      html: HTML_TEMPLATE(messageText),
    },
    info => {
      console.log('Email sent successfully');
      console.log('MESSAGE ID: ', info.messageId);
    }
  );
};

const orderHTML = (information, products, host, totalSum) => {
  const toVND = number => {
    return number
      .toString()
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev;
      });
  };
  // <td>${item.productId.images[0]}</td>
  return `<div>
      <h1>Dear ${information.fullName},</h1>
      <h5>Phone: ${information.phoneNumber}</h5>
      <h5>Address: ${information.address}</h5>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Image</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        ${products.map(item => {
          return `<tbody>
              <tr>
                <td>${item.productId.name}</td>
                <td>${`<img src='${host}/${item.productId.images[0].replace(
                  '\\',
                  '/'
                )}' alt=${item.productId.title} />`}</td>
                <td>${toVND(item.productId.price)} VND</td>
                <td>${item.quantity}</td>
                <td>${toVND(item.quantity * item.productId.price)} VND</td>
              </tr>
            </tbody>`;
        })}
      </table>
      <h1>All Total: ${toVND(totalSum)} VND</h1>
      <h1>Thank you!</h1>
    </div>`;
};

exports.getCart = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    const userId = authHeader.split(' ')[1];
    req.user = await User.findById(userId).populate({
      path: 'cart.items',
      populate: { path: 'productId' },
    });

    res.status(200).json(req.user.cart);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const userId = req.body.userId;
    const quantity = req.body.quantity;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          quantity: quantity,
        },
        validationErrors: errors.array(),
      });
    }

    const product = await Product.findById(prodId);

    req.user = await User.findById(userId);

    req.user.addToCart(product, quantity);

    res.status(201).json('The product has been added to cart.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.deleteProductInCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const userId = req.body.userId;

    req.user = await User.findById(userId);

    req.user.removeFromCart(prodId);
    res.status(201).json('The product has been removed from the cart.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    // const prodId = req.body.productId;
    const userId = req.body.userId;
    const fullName = req.body.fullName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
        },
        validationErrors: errors.array(),
      });
    }

    req.user = await User.findById(userId).populate({
      path: 'cart.items',
      populate: { path: 'productId' },
    });

    let totalSum = 0;

    req.user.cart.items.forEach(p => {
      totalSum += p.quantity * p.productId.price;
    });

    const products = req.user.cart.items.map(i => {
      return { quantity: i.quantity, productId: { ...i.productId._doc } };
    });

    const order = new Order({
      user: req.user,
      products: products,
      information: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
      },
    });

    const savedOrder = await order.save();

    products.map(async i => {
      const prod = await Product.findById(i.productId._id);
      let newQuantity;
      newQuantity = prod.quantity - i.quantity;
      prod.quantity = newQuantity;
      await prod.save();
    });

    const information = {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
    };

    const host = req.protocol + '://' + req.get('host');

    transporter({
      to: information.email,
      subject: 'Order succeeded!',
      message: orderHTML(information, products, host, totalSum),
    });

    // THANH TOAN
    // stripe.charges.create({
    //   amount: totalSum,
    //   currency: 'vnd',
    //   description: 'Order',
    //   source: token,
    //   metadata: { order_id: savedOrder._id.toString() },
    // });

    await req.user.clearCart();

    res.status(201).json('Order succeeded!');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    const userId = authHeader.split(' ')[1];

    req.user = await User.findById(userId);

    const orders = await Order.find({ user: req.user._id });

    res.status(201).json(orders);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    res.status(201).json(order);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
    })
    .catch(err => next(err));
};
