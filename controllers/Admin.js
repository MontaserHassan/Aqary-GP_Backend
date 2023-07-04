const logger = require('../config/logger');
const TransactionModel = require('../models/TransactionModel');
const Property = require('../models/propertyModel');
const cache = require('../config/cache');
const { default: mongoose } = require('mongoose');

const isAdmin = (req, res) => {
    return res.status(200).json({
      message: 'yes' 
    });
}

const getProfitAndPercentageDifference = async () => {
  if(!cache.get('thisMonthTotal')){
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
    
    const [thisMonth, lastMonth] = await Promise.all([
      TransactionModel.aggregate([
        { $match: { createdAt: { $gte: thisMonthStart, $lte: new Date() } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      TransactionModel.aggregate([
        { $match: { createdAt: { $gte: lastMonthStart, $lte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const thisMonthTotal = thisMonth.length > 0 ? thisMonth[0].total : 0;
    const lastMonthTotal = lastMonth.length > 0 ? lastMonth[0].total : 0;
    const percentageDifference = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

    cache.set('thisMonthTotal', thisMonthTotal);
    cache.set('percentageDifference', percentageDifference);

    console.log(lastMonthTotal)
    return { thisMonthTotal, percentageDifference };
  } else {
    return {
      thisMonthTotal: cache.get('thisMonthTotal'),
      percentageDifference: cache.get('percentageDifference'),
    };
  }
}

const getAmountForUserAndCount = async (req, res) => {
    try {
      const amountForUserAndCount = await TransactionModel.aggregate([
        {
          $group: {
            _id: "$userId",
            propertyCount: { $sum: 1 },
            transactionAmount: { $sum: "$amount" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $project: {
            "user.firstName": 1,
            "user.lastName": 1,
            propertyCount: 1,
            transactionAmount: 1
          }
        }
      ]);
      res.json(amountForUserAndCount);
    } catch (err) {
      logger.error(err.message);
      throw new Error('Server error: ' + err.message);
    };

};

const getCountPropertiesForEachCity = async (req, res) => {
  if(!cache.get('getCountPropertiesForEachCity')){
    try {
      const countPropertiesForEachCity = await Property.aggregate([
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
        {
          $sort: {
            count: -1
          }
        },
        { $limit: 5 },
      ]);
      cache.set('countPropertiesForEachCity', countPropertiesForEachCity);
      res.json({countPropertiesForEachCity});
    } catch (err) {
      logger.error(err.message);
      throw new Error('Server error: ' + err.message);
    };
  }else{
    res.json({countPropertiesForEachCity: cache.get('getCountPropertiesForEachCity')});
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

const getPropertyTable = async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    address,
    city,
    title,
    subscribe,
    minPrice,
    maxPrice,
  } = req.query;
  


  let pgSize;
  if (![10, 25, 50].includes(pageSize)) pgSize = 10;
  else pgSize = pageSize;
  const skip = (page - 1) * pgSize;

  const filter = {};
  if (address) filter.address = { $regex: new RegExp(address, 'i') };
  if (city) filter.city = { $regex: new RegExp(city, 'i') };
  if (title) filter.title = { $regex: new RegExp(title, 'i') };
  if (subscribe) filter.subscribe = subscribe;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  try {
    const query = Property.find(filter)
      .skip(skip)
      .limit(parseInt(pgSize))
      .populate('user');
    const countQuery = Property.countDocuments(filter);
    const [properties, count] = await Promise.all([query, countQuery]);

    res.json({
      data: properties,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: count,
        totalPages: Math.ceil(count / pageSize)
      },
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = {statistics, getCountPropertiesForEachCity, getPropertyTable, getAmountForUserAndCount, isAdmin};