const Property = require("../models/propertyModel");
const { asyncFunction } = require("../middlewares/asyncHandler");
const {
  createUrlProperty,
  deleteUrlPhoto,
} = require("../middlewares/fileParser");

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
  if (!req.files || req.files.length === 0)
    throw { status: 400, message: "no images uploaded" };
  const photos = await Promise.all(
    req.files.map(async (file) => {
      const photo = await createUrlProperty(
        `${file.destination}/${file.filename}`
      );
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
  property
    .save()
    .then(() => res.status(200).send(property))
    .catch((error) => res.json(error));
});

//////////////////////////////// get all Properties//////////////////////////////////////

const getAllProperties = asyncFunction(async (req, res) => {
  const properties = await Property.find();
  if (!properties) throw { status: 404, message: "No Properties Found" };
  res.status(200).send(properties);
});

//////////////////////////////////////////////get Property by id /////////////////////

const getProperty = asyncFunction(async (req, res) => {
  const {
    params: { id },
  } = req;
  const property = await Property.findById(id);
  if (!property) throw { status: 404, message: "No Properties Found" };
  res.status(200).send(property);
});

// edit Property by id


const editProperty = asyncFunction(async (req, res) => {
  const {
    params: { id },
  } = req;

  const selectedProperty = await Property.findById(id);
  if (! selectedProperty) throw {status: 404, message: 'property not found'};
  
  selectedProperty.address = req.body.address;
  selectedProperty.city = req.body.city;
  selectedProperty.level = req.body.level;
  selectedProperty.rooms = req.body.rooms;
  selectedProperty.baths = req.body.baths;
  selectedProperty.area = req.body.area;
  selectedProperty.description = req.body.description;
  selectedProperty.price = req.body.price;
  selectedProperty.contractPhone = req.body.contractPhone;
  selectedProperty.photos = req.body.photos;
  selectedProperty.paymentOption = req.body.paymentOption;
  selectedProperty.subscribe = req.body.subscribe;
  selectedProperty.endTime = req.body.endTime;
  const updatedProperty = await selectedProperty.save();

  if(!updatedProperty) throw {status: 404, message: 'property not found'};
  
  res.status(200).send(updatedProperty);
  
});

const deleteProperty = (req, res, next) => {
  const {
    params: { id },
  } = req;
  Property.findByIdAndDelete(id)
    .then(() => res.json("Deleted Success"))
    .catch((error) => res.json(error));
};

module.exports = {
  createProperty,
  getAllProperties,
  getProperty,
  editProperty,
  deleteProperty,
};
