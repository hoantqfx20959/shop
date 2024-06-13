const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/auth');
const Order = require('../models/order.js');
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

const maxAge = 24 * 60 * 60;
const createToken = id => {
  return jwt.sign({ id }, 'kishan sheth super secret key', {
    expiresIn: maxAge,
  });
};

const handleErrors = err => {
  let errors = { username: '', password: '' };

  console.log(err);
  if (err.message === 'incorrect username') {
    errors.username = 'That username is not registered';
  }

  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  if (err.code === 11000) {
    errors.username = 'Username is already registered';
    return errors;
  }

  if (err.message.includes('Users validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

exports.postSignup = async (req, res, next) => {
  try {
    const {
      username,
      password,
      fullName,
      phoneNumber,
      email,
      isAdmin,
      isAdviser,
      isClient,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          username: username,
          password: password,
          fullName: fullName,
          phoneNumber: phoneNumber,
          email: email,
          isAdmin: isAdmin,
          isAdviser: isAdviser,
          isClient: isClient,
        },
        validationErrors: errors.array(),
      });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      hashPassword,
      fullName,
      phoneNumber,
      email,
      isAdmin,
      isAdviser,
      isClient,
    });

    const token = createToken(user._id);

    res.status(201).json({
      token: token,

      userId: user._id,
      created: true,
    });

    transporter({
      to: email,
      subject: 'Signup succeeded!',
      message: 'You successfully signed up!',
    });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          username: username,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }

    const user = await User.login(username, password);
    const token = createToken(user._id);

    res.status(200).json({
      token: token,
      userId: user._id,
      status: true,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    const userId = authHeader.split(' ')[1];
    const user = await User.findById(userId).populate({
      path: 'cart.items',
      populate: { path: 'productId' },
    });

    res.status(200).json(user);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.postReset = async (req, res, next) => {
  try {
    const origin = req.get('origin');
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
        res.json({ err, status: false });
      }
      const token = buffer.toString('hex');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errorMessage: errors.array()[0].msg,
          oldInput: {
            username: req.body.username,
          },
          validationErrors: errors.array(),
        });
      }
      const user = await User.findOne({ username: req.body.username });
      user.resetToken = token;
      user.resetExpiration = Date.now() + 15 * 60 * 1000;
      user.save();
      res.status(200).json({ userId: user._id, status: true });
      transporter({
        to: user.email,
        subject: 'Password reset',
        message: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${origin}/new-password/${token}">link</a> to set a new password.</p>
      `,
      });
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    await User.findOne({
      resetToken: token,
      resetExpiration: { $gt: Date.now() },
    }).then(user => {
      res.status(200).json({
        userId: user._id.toString(),
        passwordToken: token,
      });
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          username: req.body.username,
        },
        validationErrors: errors.array(),
      });
    }

    const resetUser = await User.findOne({
      resetToken: passwordToken,
      resetExpiration: { $gt: Date.now() },
      _id: userId,
    });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    resetUser.password = hashPassword;
    resetUser.resetToken = undefined;
    resetUser.resetExpiration = undefined;
    resetUser.save();

    const token = createToken(resetUser._id);

    res.status(201).json({
      token: token,
      user: resetUser._id,
      created: true,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

/////////////////// admin /////////////////////

exports.getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getAdminUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.putAdminUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.deleteAdminUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};
