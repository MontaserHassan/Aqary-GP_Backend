/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable eol-last */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable comma-dangle */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable no-multiple-empty-lines */
const mongoose = require('mongoose');

const { Schema } = mongoose;


const propertySchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
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
    photo: {
      type: [String],
      required: true,
    },
    paymentOption: {
      type: String,
      enum: ['cash', 'master-card'],
      required: true,
    },
    subscribe: {
      type: String,
      enum: ['half', 'hour', 'day', 'week', 'month'],
      required: true,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


const Property = mongoose.model('Property', propertySchema);



module.exports = Property;