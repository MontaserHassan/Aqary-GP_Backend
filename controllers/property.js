const Property = require("../models/propertyModel");
//  create new property
const addProperty = (req, res, next) => {
  const {
    address,
    city,
    title,
    level,
    rooms,
    baths,
    area,
    description,
    price,
    contractPhone,
    photos,
    paymentOption,
    subscribe,
  } = req.body;
  const property = new Property({
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
  });

  property
    .save()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    });
};
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
      res.json('Updated Succesful');
    })
    .catch((error) => {
      res.json(error);
    });
};

const deleteProperty = (req, res, next)=>{

  const { params: { id } } = req;

  Property.findByIdAndDelete(id).then(() => { res.json('Deleted Success')}).catch((error)=> res.json(error));
}

module.exports = { addProperty, getAllProperties, getProperty, editProperty, deleteProperty };
