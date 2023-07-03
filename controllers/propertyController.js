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
require('../boot/propertyBooting');
const { payForPropertyPost } = require('./transactionController');


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
// const createPropertyFunction = asyncFunction(async (data, amount, userId, files) => {
//   const valueOfAdd = {
//     PROPERTY_HOUR: {
//       value: 1.0, time: 'hour',
//     },
//     PROPERTY_DAY: {
//       value: 2.0, time: 'day',
//     },
//     PROPERTY_WEEK: {
//       value: 5.0, time: 'week'
//     },
//     PROPERTY_MONTH: {
//       value: 10.0, time: 'month'
//     },
//   }
//   if (!files || files.length === 0) throw { status: 400, message: 'no images uploaded' };
//   if (data.description && Number.parseFloat(amount) === Number.parseFloat(valueOfAdd[data.subscribe].value)) throw { status: 400, message: 'you have an error in amount' };
//   const photos = await Promise.all(
//     files.map(async (file) => {
//       const photo = await createUrlProperty(`${file.destination}/${file.filename}`);
//       return photo;
//     })
//   );
//   // if (!req.user) throw { status: 401, message: "doesn't create property without logged in user" };
//   const property = new Property({
//     user: userId,
//     address: data.address,
//     city: data.city,
//     title: data.title,
//     level: data.level,
//     rooms: data.rooms,
//     baths: data.baths,
//     area: data.area,
//     description: data.description,
//     price: data.price,
//     contractPhone: data.contractPhone,
//     photo: photos,
//     paymentOption: data.paymentOption,
//     subscribe: data.subscribe,
//     endTime: calculateEndTime(data.subscribe),
//   });
//   if (!property) throw { status: 400, message: 'Bad Request' };
//   return property.save()
//     .then(() => true)
//     .catch((error) => {
//       throw { status: 400, message: error.message };
//     });
// });

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
    console.log(pay);
    // if (!req.user) throw { status: 401, message: "doesn't create property without logged in user" };
    const property = await Property.create({
      user: req?.user?._id || '649db4ae75fc1c6db6d97554',
      address: req.body.address,
      city: req.body.city,
      title: req.body.title,
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
    console.log(property);
    if (!property) throw { status: 400, message: 'Bad Request' };
    if (pay) {
      try {
        const userId = req?.user?._id || '649db4ae75fc1c6db6d97554';
        const propertyId = property._id;
        const amount = req.body.amount;
        const payment = req.body.paymentOption;
        const duration = valueOfAdd[req.body.subscribe].time;

        await payForPropertyPost(userId, propertyId, amount, payment, duration);
      } catch (err) {
        console.log(err);
        throw { status: 500, message: 'Error processing transaction' };
      }
    }


    res.status(200).json(property)
  } catch (err) {
    console.log(err);
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
  const properties = await Property.find().skip(skip).sort({ createdAt: -1 }).limit(pageSize);
  res.status(200).send({ page: page, pageSize: pageSize, properties: properties, totalPages: totalPages, totalProperties: totalProperties });
});


//////////////////////////////////// get Property ///////////////////////////////////////


const getProperty = asyncFunction(async (req, res) => {
  const property = await Property.findById(req.params.id).populate({ path: 'user' }).exec();
  if (!property) throw { status: 404, message: 'No Properties Found' };
  res.status(200).send(property);
});


//////////////////////////////////// update Property ///////////////////////////////////////


const editProperty = asyncFunction(async (req, res) => {
  // console.log(req.files);
  // if (!req.files || req.files.length === 0) throw { status: 400, message: 'no images uploaded' };
  const photos = await Promise.all(
    req.files.map(async (file) => {
      const photo = await createUrlProperty(
        `${file.destination}/${file.filename}`
      );
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
  if (!updatedProperty) throw { status: 404, message: 'property cant update' };
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
  if (!property) {
    throw { status: 404, message: 'Property not found' };
  }
  res.status(200).send(property);
});




module.exports = {
  createProperty,
  getAllProperties,
  getProperty,
  editProperty,
  deleteProperty,
  searchOnProperty,

};
