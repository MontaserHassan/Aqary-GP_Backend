const mongoose = require('../config/database');

const transactionController = (req, res) => {
  mongoose.transaction(async (session) => {
    const { userId } = req.body;
    const sender = await User.findById(userId).session(session);
    const transaction = new Transaction({
      userId,
      // if user send money to us => true
      // we send money to user's wallet => false
      sender: true,
      amount: 100,
      description: 'userBuyAds',
    });
    sender.balance -= transaction.amount;
    await sender.save({ session });

    // i will use cache here ====>

    // site.balance += transaction.amount;
    // await site.save({ session });

    await transaction.save({ session });
  })
    .then(() => {
      res.status(201).json({
        status: 'success',
        data: 'you set ads on your property successfully',
      });
    })
    .catch((error) => {
      res.status(407).json({
        status: 'error',
        data: error.message,
      });
    });
};

module.exports = transactionController;
