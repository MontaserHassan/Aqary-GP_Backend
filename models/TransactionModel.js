const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  paymentId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  TransactionType: {
    type: String,
    enum: ['subscription', 'property', 'wallet']
  },
  propertyDuration: {
    type: String,
    enum: ['day', 'week', 'month'],
    required: function () { return this.TransactionType === 'property' },
  },
  subscriptionDuration: {
    type: String,
    enum: ['day', 'week', 'month'],
    required: function () { return this.TransactionType === 'subscription' },
  },
  walletAmount: {
    type: Number,
    required: function () {
      return this.transactionType === 'wallet';
    },
  },
  amount: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;