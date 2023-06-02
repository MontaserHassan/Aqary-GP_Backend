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
  const property = new Property.Property({
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
    photos,
    photos,
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
  Property.Property.find()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    });
};



module.exports = { addProperty, getAllProperties };
