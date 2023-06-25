const TransactionModel = require('../models/TransactionModel');

const getProfitAndPercentageDifference = async () => {
  const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0); // start of this month
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0); // start of last month
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999); // end of this month

    const [thisMonth, lastMonth] = await Promise.all([
      Transaction.aggregate([
        { $match: { sender: false, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } } }, // filter transactions where we send money to user's wallet and created in this month
        { $group: { _id: null, total: { $sum: '$amount' } } } // group the transactions and calculate the sum of the amounts
      ]),
      Transaction.aggregate([
        { $match: { sender: false, createdAt: { $gte: lastMonthStart, $lte: thisMonthStart } } }, // filter transactions where we send money to user's wallet and created in last month
        { $group: { _id: null, total: { $sum: '$amount' } } } // group the transactions and calculate the sum of the amounts
      ])
    ]);

    const thisMonthTotal = thisMonth.length ? thisMonth[0].total : 0; // get the total or set it to 0 if there are no profits in this month
    const lastMonthTotal = lastMonth.length ? lastMonth[0].total : 0; // get the total or set it to 0 if there are no profits in last month
    const percentageDifference = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

    return { thisMonthTotal, percentageDifference };
}

module.exports = async (req, res) => {
  try {
    const { thisMonthTotal, percentageDifference } = await getProfitAndPercentageDifference();
    const count = await TransactionModel.distinct('userId').countDocuments();
    const profits = await TransactionModel.aggregate([
      { $match: { sender: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalProfits = profits.length ? profits[0].total : 0;
    res.status(200).json({ count, totalProfits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};