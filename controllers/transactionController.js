const mongoose = require('../config/database');
const Transaction = require('../models/TransactionModel')

// Create a new transaction for subscription
const subscribeService = async (userId, amount, payment, duration) => {
  const transaction = new Transaction(
    {
      userId,
      amount,
      payment,
      TransactionType: 'subscription',
      subscriptionDuration: duration,
    });

  await transaction.save();
  console.log('Subscription transaction saved', transaction);
}

// Create a new transaction for property payment
const payForPropertyPost = async (userId, propertyId, amount, payment, duration) => {
  const transaction = new Transaction({
    userId,
    propertyId,
    amount,
    payment,
    TransactionType: 'property',
    propertyDuration: duration,
  });

  await transaction.save();

  console.log('Property payment transaction saved:', transaction);
}

// Create a new transaction for adding money to wallet
const addMoneyToWallet = async (userId, amount, payment) => {
  const transaction = new Transaction({
    userId,
    amount,
    payment,
    TransactionType: 'wallet',
    walletAmount: amount,

  })

  await transaction.save();
  console.log('Wallet transaction saved:', transaction);
}




// const createTransaction = async (userId, propertyId, amount, payment, duration, TransactionType) => {

//   try {
//     // const { userId, propertyId, amount, payment, duration, TransactionType } = req.body;
//     const { id } = req.body.transactionsData;
//     const TransactionType = "asd";
//     if (TransactionType == 'subscription') {

//       await subscribeService(userId, amount, payment, duration);

//     }
//     else if (TransactionType === 'property') {

//       await payForPropertyPost(userId, propertyId, amount, payment, duration);

//     }
//     else if (TransactionType === 'wallet') {

//       await addMoneyToWallet(userId, amount, payment)
//     }
//     else {
//       return res.status(400).json({ error: 'Invalid transaction type' });
//     }
//     return res.status(200).json({ message: 'Transaction created successfully' });
//   } catch (err) {

//     res.status(500).json({ error: 'Invalid Server Error' });
//     console.error('Error creating transaction:', err);

//   }
// }

// const createTransaction = async (userId, propertyId, amount, payment, duration, transactionType) => {

//   if (transactionType === 'subscription') {

//     await subscribeService(userId, amount, payment, duration);

//   } else if (transactionType === 'property') {

//     await payForPropertyPost(userId, propertyId, amount, payment, duration);

//   } else if (transactionType === 'wallet') {

//     await addMoneyToWallet(userId, amount, payment);

//   } else {
//     throw new Error('Invalid transaction type');
//   }
// }


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
    const transactions = await Transaction.find().populate('userId');
    res.json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  payForPropertyPost,
  getTransactionById,
  getAllTransactions,
  deleteTransactionById,
};



