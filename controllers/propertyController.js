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


//////////////////////////////////// create property //////////////////////////////////////


const createProperty = asyncFunction(async (req, res) => {
  if (!req.files || req.files.length === 0)
    throw { status: 400, message: "no images uploaded" };
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


//////////////////////////////// get all Properties//////////////////////////////////////


const getAllProperties = asyncFunction(async (req, res) => {
  const properties = await Property.find();
  if (!properties) throw { status: 404, message: "No Properties Found" };
  res.status(200).send(properties);
});


//////////////////////////////////// get Property ///////////////////////////////////////


const getProperty = asyncFunction(async (req, res) => {
  const property = await Property.findById({ _id: req.params.id });
  if (!property) throw { status: 404, message: "No Properties Found" };
  res.status(200).send(property);
});

// edit Property by id

const editProperty = asyncFunction(async (req, res) => {
  if (!req.files || req.files.length === 0)
    throw { status: 400, message: 'no images uploaded' };
  const photos = await Promise.all(
    req.files.map(async (file) => {
      const photo = await createUrlProperty(
        `${file.destination}/${file.filename}`
      );
      return photo;
    }),
  );
  const { params: { id } } = req;
  const updatedProperty = await Property.findByIdAndUpdate(
    { _id: id },
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
      subscribe: req.body.subscribe,
      endTime: req.body.endTime,
    }, { new: true }
  );
  if (!updatedProperty) throw { status: 404, message: "property cant update" };
  res.status(200).send(updatedProperty);
});


//////////////////////////////////// delete Property ///////////////////////////////////////

const deleteProperty = asyncFunction(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw { status: 404, message: "Property not found" };
  for (const photoUrl of property.photo) {
    const photoName = photoUrl.split("/").pop().split(".")[0];
    console.log(photoName)
    await deleteUrlPhoto(photoName);
  }
  const deletedProperty = await Property.findByIdAndDelete(req.params.id);
  res.status(200).send(deletedProperty);
});



module.exports = {
  createProperty,
  getAllProperties,
  getProperty,
  editProperty,
  deleteProperty,
};
