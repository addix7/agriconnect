const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { placeOrder } = require("../controllers/orderController");

router.post("/order", protect, placeOrder);

module.exports = router;