/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable spaced-comment */
const Property = require('../models/propertyModel');
const { asyncFunction } = require('../middlewares/asyncHandler');
const { createUrlProperty, deleteUrlPhoto } = require('../middlewares/fileParser');
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


const createProperty = asyncFunction(async (req, res) => {
  if (!req.files || req.files.length === 0) throw { status: 400, message: 'no images uploaded' };
  const photos = await Promise.all(
    req.files.map(async (file) => {
      const photo = await createUrlProperty(`${file.destination}/${file.filename}`);
      return photo;
    })
  );
  if (!req.user) throw { status: 401, message: "doesn't create property without logged in user" };
  const property = new Property({
    user: req.user,
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
    subscribe: req.body.subscribe,
    endTime: calculateEndTime(req.body.subscribe),
  });
  console.log(property.user);
  if (!property) throw { status: 400, message: 'Bad Request' };
  property.save()
    .then(() => res.status(200).send(property))
    .catch((error) => res.json(error));
});


//////////////////////////////// get all Properties //////////////////////////////////////


const getAllProperties = asyncFunction(async (req, res) => {
  const pageSize = 8;
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
