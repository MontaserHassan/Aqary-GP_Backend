const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
});

const cityModel = mongoose.model('City', citySchema);

module.exports = cityModel;