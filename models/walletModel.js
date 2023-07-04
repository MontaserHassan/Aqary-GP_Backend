const mongoose = require('mongoose');

const WalletShema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true
});

const WalletModel = mongoose.model('Wallet', WalletShema);

module.exports = WalletModel;