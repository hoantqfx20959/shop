const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Object,
      required: true,
      ref: 'User',
    },
    products: [
      {
        productId: { type: Object, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    information: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
