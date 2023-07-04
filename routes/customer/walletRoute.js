const express = require("express");
const router = express.Router();
const walletController = require("../../controllers/walletController");

router.post("/", walletController.createWallet);
router.get("/:userId", walletController.getWalletByUserId);
router.put("/:userId/addMoney", walletController.addMoney);

module.exports = router;