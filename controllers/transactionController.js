const mongoose = require('../config/database');
const Transaction = require('../models/TransactionModel')

// Create a new transaction for subscription
const subscribeService = async (userId, amount, paymentMethod, duration) => {
  const transaction = new Transaction(
    {
      userId,
      amount,
      paymentMethod,
      TransactionType: 'subscription',
      subscriptionDuration: duration,
    });

  await transaction.save();
  console.log('Subscription transaction saved', transaction);
}

// Create a new transaction for property payment
const payForPropertyPost = async (userId, propertyId, amount, paymentMethod, duration) => {
  const transaction = new Transaction({
    userId,
    propertyId,
    amount,
    paymentMethod,
    TransactionType: 'property',
    propertyDuration: duration,
  });

  await transaction.save();

  console.log('Property payment transaction saved:', transaction);
}

// Create a new transaction for adding money to wallet
const addMoneyToWallet = async (userId, amount, paymentMethod) => {
  const transaction = new Transaction({
    userId,
    amount,
    paymentMethod,
    TransactionType: 'wallet',
    walletAmount: amount,

  })

  await transaction.save();
  console.log('Wallet transaction saved:', transaction);
}




const createTransaction = async (req, res) => {

  try {
    // const { userId, propertyId, amount, paymentMethod, duration, TransactionType } = req.body;
    const {id} = req.body.transactionsData;
    const TransactionType = "asd";
    if (TransactionType == 'subscription') {

      await subscribeService(userId, amount, paymentMethod, duration);

    }
    else if (TransactionType === 'property') {

      await payForPropertyPost(userId, propertyId, amount, paymentMethod, duration);

    }
    else if (TransactionType === 'wallet') {

      await addMoneyToWallet(userId, amount, paymentMethod)
    } 
    else {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }
    return res.status(200).json({ message: 'Transaction created successfully' });
  } catch (err) {

    res.status(500).json({ error: 'Invalid Server Error' });
    console.error('Error creating transaction:', err);

  }
}


const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error retrieving transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTransactionById = async (req, res) => {

  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json('Delete transaction', { transaction });

  } catch (err) {

    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}


const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  deleteTransactionById,
};



