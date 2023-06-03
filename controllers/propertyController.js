const Property = require("../models/propertyModel");
const { asyncFunction } = require("../middlewares/asyncHandler");
const { createUrlProperty, deleteUrlPhoto } = require("../middlewares/fileParser");



//////////////////////////////////// handle endTime ///////////////////////////////////////


const calculateEndTime = (duration) => {
  const millisecondsInDay = 24 * 60 * 60 * 1000; // Assuming a day is 24 hours
  const currentTime = new Date();
  let durationInMilliseconds;
  if (duration === "day") {
    durationInMilliseconds = millisecondsInDay;
  } else if (duration === "week") {
    durationInMilliseconds = 7 * millisecondsInDay;
  } else if (duration === "month") {
    durationInMilliseconds = 30 * millisecondsInDay;
  } else {
    throw new Error("Invalid duration");
  }
  const endTime = new Date(currentTime.getTime() + durationInMilliseconds);
  return endTime;
};


//////////////////////////////////// create property ///////////////////////////////////////


const createProperty = asyncFunction(async (req, res) => {
  if (!req.files || req.files.length === 0) throw { status: 400, message: "no images uploaded" };
    const photos = await Promise.all(
    req.files.map(async (file) => {
      const photo = await createUrlProperty( `${file.destination}/${file.filename}` );
      return photo;
    })
  );
  const property = new Property({
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
  property.save()
  .then(() => res.status(200).send(property))
  .catch((error) => res.json(error));
});

// get all Properties
const getAllProperties = (req, res, next) => {
  Property.find()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    });
};

const getProperty = (req, res, next) => {
  const {
    params: { id },
  } = req;

  Property.findById(id)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    });
};

// edit Property by id
const editProperty = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const {
    address: address,
    city: city,
    title: title,
    level: level,
    rooms: rooms,
    baths: baths,
    area: area,
    description: description,
    price: price,
    contractPhone: contractPhone,
    photos: photos,
    paymentOption: paymentOption,
    subscribe: subscribe,
  } = req.body;
  Property.findById(id)
    .then((property) => {
      property.address = address;
      property.city = city;
      property.level = level;
      property.rooms = rooms;
      property.baths = baths;
      property.area = area;
      property.description = description;
      property.contractPhone = contractPhone;
      property.photos = photos;
      property.paymentOption = paymentOption;
      property.subscribe = subscribe;

      return property.save();
    })
    .then(() => {
      res.json("Updated Succesful");
    })
    .catch((error) => {
      res.json(error);
    });
};

const deleteProperty = (req, res, next) => {
  const {
    params: { id },
  } = req;
  Property.findByIdAndDelete(id)
    .then(() => res.json("Deleted Success") )
    .catch((error) => res.json(error));
};

module.exports = {
  createProperty,
  getAllProperties,
  getProperty,
  editProperty,
  deleteProperty,
};
