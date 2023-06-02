const mongoose = require("mongoose");

const { Schema } = mongoose;

const propertySchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      enum: ["villa", "shale", "apartment"],
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    contractPhone: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      required: true,
    },
    paymentOption: {
      type: String,
      enum: ["cash", "master-card"],
      required: true,
    },
    subscribe: {
      type: String,
      enum: ["day", "week", "month"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = {
  Property,
};
