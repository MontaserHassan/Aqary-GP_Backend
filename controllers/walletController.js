const mongoose = require('../config/database');
const Wallet = require('../models/walletModel')


const createWallet = async (req, res) => {
    try {
        const userId = req.body.userId;

        const existingWallet = await Wallet.findOne({ userId });
        if (existingWallet) {
            return res.status(400).json({ message: "A wallet for this user already exists" });
        }

        const wallet = new Wallet({ userId });

        await wallet.save();
        res.status(201).json(wallet);
    } catch (error) {
        res.status(400).json({ message: "Error creating wallet", error });
    }
};

const getWalletByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        res.status(200).json(wallet);
    } catch (error) {
        res.status(400).json({ message: "Error getting wallet", error });
    }
};
const addMoney = async (req, res) => {
    try {
        const userId = req.params.userId;
        const amount = parseFloat(req.body.amount);
        console.log(userId, amount);

        // Find the wallet first
        const wallet = await Wallet.findOne({ userId });
        console.log(wallet);

        // Check if the wallet exists
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        // Update the wallet balance
        wallet.balance += amount;
        await wallet.save();

        // Return the updated wallet
        res.status(200).json(wallet);
    } catch (error) {
        res.status(400).json({ message: "Error adding money", error });
    }
};
module.exports = {
    createWallet,
    addMoney,
    getWalletByUserId

};