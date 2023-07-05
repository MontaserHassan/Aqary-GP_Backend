/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable spaced-comment */
const Property = require('../models/propertyModel');
const { asyncFunction } = require('../middlewares/asyncHandler');
const paypalApi = require('./paypalApi');
const { createUrlProperty, deleteUrlPhoto } = require('../middlewares/fileParser');
const { payForPropertyPost } = require('./transactionController');
require('../boot/propertyBooting');


//////////////////////////////////// handle endTime ///////////////////////////////////////


// const calculateEndTime = (duration) => {
//   let durationInMilliseconds = 3 * 60 * 1000; // 3 minutes
//   const currentTime = new Date();
//   if (duration === 'half') {
//     durationInMilliseconds = new Date(currentTime.getTime() + durationInMilliseconds);
//   }
//   const endTime = durationInMilliseconds;
//   return endTime;
// };

const calculateEndTime = (duration) => {
  const millisecondsInDay = 1 * 60 * 60 * 1000; // one hour
  const currentTime = new Date();
  let durationInMilliseconds;
  if (duration === 'hour') {
    durationInMilliseconds = millisecondsInDay;
  } else if (duration === 'day') {
    durationInMilliseconds = 24 * millisecondsInDay;
  } else if (duration === 'week') {
    durationInMilliseconds = 7 * 24 * millisecondsInDay;
  } else if (duration === 'month') {
    durationInMilliseconds = 30 * 24 * millisecondsInDay;
  } else {
    throw new Error('Invalid duration');
  }
  const endTime = new Date(currentTime.getTime() + durationInMilliseconds);
  return endTime;
};


//////////////////////////////////// create property //////////////////////////////////////


const valueOfAdd = {
  PROPERTY_HOUR: {
    value: 1.0, time: 'hour',
  },
  PROPERTY_DAY: {
    value: 2.0, time: 'day',
  },
  PROPERTY_WEEK: {
    value: 5.0, time: 'week'
  },
  PROPERTY_MONTH: {
    value: 10.0, time: 'month'
  },
}
const createProperty = asyncFunction(async (req, res) => {
  if (!req.files || req.files.length === 0) throw { status: 400, message: 'no images uploaded' };
  if (req.body.description && Number.parseFloat(req.body.amount) !== Number.parseFloat(valueOfAdd[req.body.subscribe].value)) throw { status: 400, message: 'you have an error in amount' };
  const photos = await Promise.all(
    req.files.map(async (file) => {
      const photo = await createUrlProperty(`${file.destination}/${file.filename}`);
      return photo;
    })
  );
  try {
    const pay = await paypalApi.capturePayment(req.body.orderID);
    const property = await Property.create({
      user: req?.user?._id || '649db4ae75fc1c6db6d97554',
      address: req.body.address,
      city: req.body.city,
      categoryId: req.body.categoryId,
      level: req.body.level,
      rooms: req.body.rooms,
      baths: req.body.baths,
      area: req.body.area,
      description: req.body.description,
      price: req.body.price,
      contractPhone: req.body.contractPhone,
      photo: photos,
      paymentOption: req.body.paymentOption,
      subscribe: valueOfAdd[req.body.subscribe].time,
      endTime: calculateEndTime(valueOfAdd[req.body.subscribe].time),
    });
    console.log(req?.user?._id);
    if (!property) throw { status: 400, message: 'Bad Request' };
    try {
      const userId = req?.user?._id || '649db4ae75fc1c6db6d97554';
      const propertyId = property._id;
      const paymentId = pay?.id;
      const amount = req.body.amount;
      const payment = req.body.paymentOption;
      const duration = valueOfAdd[req.body.subscribe].time;
      const transaction = await payForPropertyPost(userId, propertyId, paymentId, amount, payment, duration);
      console.log(transaction);
    } catch (err) {
      console.log(err);
      throw { status: 500, message: 'Error processing transaction' };
    }
    res.status(200).json(property)
  } catch (err) {
    throw { status: 400, message: err.message };
  }
});


//////////////////////////////// get all Properties //////////////////////////////////////


const getAllProperties = asyncFunction(async (req, res) => {
  const pageSize = 9;
  let page = req.query.page || 1;
  let skip = (page - 1) * pageSize;
  const totalProperties = await Property.countDocuments();
  const totalPages = Math.ceil(totalProperties / pageSize);
  if (page > totalPages) {
    throw { status: 404, message: 'There are no properties in this page' };
  };
  const properties = await Property.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate({ path: 'categoryId' });
  res.status(200).send({ page: page, pageSize: pageSize, properties: properties, totalPages: totalPages, totalProperties: totalProperties });
});


//////////////////////////////////// get Property ///////////////////////////////////////


const getProperty = asyncFunction(async (req, res) => {
  const property = await Property.findById(req.params.id).populate({ path: 'user', path: 'categoryId' }).exec();
  if (!property) throw { status: 404, message: 'No Properties Found' };
  res.status(200).send(property);
});


//////////////////////////////////// update Property ///////////////////////////////////////


const editProperty = asyncFunction(async (req, res) => {
  const photos = await Promise.all(
    req.files.map(async (file) => {
      const photo = await createUrlProperty(`${file.destination}/${file.filename}`);
      return photo;
    })
  );

  const updatedProperty = await Property.findByIdAndUpdate(
    { _id: req.params.id },
    {
      address: req.body.address,
      city: req.body.city,
      level: req.body.level,
      rooms: req.body.rooms,
      baths: req.body.baths,
      area: req.body.area,
      description: req.body.description,
      price: req.body.price,
      contractPhone: req.body.contractPhone,
      photo: photos,
      paymentOption: req.body.paymentOption,
    },
    { new: true },
  );
  // eslint-disable-next-line no-throw-literal
  if (!updatedProperty) throw { status: 404, message: "property can't update" };
  res.status(200).send(updatedProperty);
});


//////////////////////////////////// delete Property ///////////////////////////////////////


const deleteProperty = asyncFunction(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw { status: 404, message: 'Property not found' };
  for (const photoUrl of property.photo) {
    const photoName = photoUrl.split('/').pop().split('.')[0];
    console.log(photoName);
    await deleteUrlPhoto(photoName);
  }
  const deletedProperty = await Property.findByIdAndDelete(req.params.id);
  res.status(200).send(deletedProperty);
});


//////////////////////////////////// search on Property ///////////////////////////////////////


const searchOnProperty = asyncFunction(async (req, res) => {
  const property = await Property.find({ city: { $regex: new RegExp(req.params.city, 'i') } });
  if (!property) throw { status: 404, message: 'Property not found' };
  res.status(200).send(property);
});


//////////////////////////////////// get Properties for user ///////////////////////////////////////


const getPropertiesForUser = asyncFunction(async (req, res) => {
  if (!req.user) throw { status: 400, message: 'User not found' };
  const properties = await Property.find({ user: req.user._id });
  if (!properties || properties.length === 0) throw { status: 404, message: `No Properties for ${req.user.firstName} ${req.user.lastName}` };
  res.status(200).send(properties);
});


//////////////////////////////////// get Properties by price ///////////////////////////////////////


const filterPropertiesByPrice = async (req, res) => {
  const pageSize = 9;
  let page = req.query.page || 1;
  let skip = (page - 1) * pageSize;
  const properties = await Property.find({ price: { $gte: req.params.min } }).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
  const totalProperties = await Property.countDocuments({ price: { $gte: req.params.min } });
  const totalPages = Math.ceil(totalProperties / pageSize);
  if (!properties || properties.length === 0) throw { status: 404, message: 'No properties for this range' };
  res.status(200).send({ page: page, pageSize: pageSize, properties: properties, totalPages: totalPages, totalProperties: totalProperties });
};




module.exports = {
  createProperty,
  getAllProperties,
  getProperty,
  editProperty,
  deleteProperty,
  searchOnProperty,
  getPropertiesForUser,
  filterPropertiesByPrice
};