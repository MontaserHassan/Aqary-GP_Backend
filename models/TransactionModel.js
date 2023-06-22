const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender : {
    // if user send money to us => true 
    // we send money to user's wallet => false
    type: Boolean,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    enum: ['userBuyPropertyAds', 'userBuyAds', 'userPutInHisWallet'],
    required: true
  }
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;