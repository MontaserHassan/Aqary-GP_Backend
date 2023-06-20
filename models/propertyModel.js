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
const schedule = require('node-schedule');

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
      enum: ['villa', 'shale', 'apartment'],
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
      enum: ['day', 'week', 'month'],
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


//////////////////////////////////// Schedule Property Deletion ///////////////////////////////////////

const schedulePropertyDeletion = (propertyId, endTime) => {
  schedule.scheduleJob(endTime, async () => {
    try {
      await Property.findByIdAndDelete(propertyId);
      console.log(`Property with ID ${propertyId} deleted at ${endTime}`);
    } catch (error) {
      console.log(`Error deleting property with ID ${propertyId}: ${error}`);
    }
  });
};

propertySchema.pre('save', function (next) {
  const propertyId = this._id;
  const endTime = this.endTime;
  schedulePropertyDeletion(propertyId, endTime);
  next();
});


const Property = mongoose.model('Property', propertySchema);



module.exports = Property;