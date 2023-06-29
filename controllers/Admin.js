const logger = require('../config/logger');
const TransactionModel = require('../models/TransactionModel');
const Property = require('../models/propertyModel');
const cache = require('../config/cache');

const getProfitAndPercentageDifference = async () => {
  if(!cache.get('thisMonthTotal')){
    const today = new Date();
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0); // start of this month
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0); // start of last month
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999); // end of this month
  
      const [thisMonth, lastMonth] = await Promise.all([
        TransactionModel.aggregate([
          { $match: { sender: false, createdAt: { $gte: thisMonthStart, $lte: thisMonthEnd } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        TransactionModel.aggregate([
          { $match: { sender: false, createdAt: { $gte: lastMonthStart, $lte: thisMonthStart } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);
  
      const thisMonthTotal = thisMonth.length ? thisMonth[0].total : 0;
      const lastMonthTotal = lastMonth.length ? lastMonth[0].total : 0;
      const percentageDifference = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

      cache.set('thisMonthTotal', thisMonthTotal);
      cache.set('percentageDifference', percentageDifference);

      return { thisMonthTotal, percentageDifference };
  }else{
    return {
      thisMonthTotal: cache.get('thisMonthTotal'),
      percentageDifference: cache.get('percentageDifference'),
    };
  }
}

const getCountPropertiesForEachCity = async (req, res) => {
  if(!cache.get('countOfProperties')){
    try {
      const countOfProperties = await Property.aggregate([
        {
          $group: {
            _id: "$city",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            city: "$_id",
            count: 1
          }
        },
        { $limit: 5 }
      ]);
      cache.set('countOfProperties', countOfProperties);
      res.json(countOfProperties);
    } catch (err) {
      logger.error(err.message);
      throw new Error('Server error: ' + err.message);
    };
  }else{

  }

};

const statistics = async (req, res) => {
  try {
    let countPaidUser = cache.get('countPaidUser');
    let countOfProperties = cache.get('countOfProperties');
    let totalProfits = cache.get('totalProfits');
    let thisMonthTotal = cache.get('thisMonthTotal');
    let percentageDifference = cache.get('percentageDifference');

    if (!countPaidUser) {
      countPaidUser = await TransactionModel.distinct('userId').countDocuments();
      cache.set('countPaidUser', countPaidUser);
    }

    if (!countOfProperties) {
      countOfProperties = await Property.countDocuments();
      cache.set('countOfProperties', countOfProperties);
    }

    if (!totalProfits) {
      const profits = await TransactionModel.aggregate([
        { $match: { sender: false } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      totalProfits = profits.length > 0 ? profits[0].total : 0;
      cache.set('totalProfits', totalProfits);
    }

    if (!thisMonthTotal || !percentageDifference) {
      const { thisMonthTotal: monthTotal, percentageDifference: diff } = await getProfitAndPercentageDifference();
      thisMonthTotal = monthTotal;
      percentageDifference = diff;
      cache.set('thisMonthTotal', thisMonthTotal);
      cache.set('percentageDifference', percentageDifference);
    }

    res.status(200).json({ countPaidUser, totalProfits, thisMonthTotal, percentageDifference, countOfProperties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {statistics, getCountPropertiesForEachCity};