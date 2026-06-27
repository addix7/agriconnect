const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const {
  placeOrder,
  acceptOrder,
  rejectOrder,
  deliverOrder,
  getOrders,
  getMyOrders,
  getMyMiddlemanOrders
} = require("../controllers/orderController");

router.post("/order", protect, placeOrder);
router.put("/order/:id/accept", protect, acceptOrder);
router.put("/order/:id/reject", protect, rejectOrder);
router.get("/orders", protect, getOrders);
router.get("/my-orders", protect, getMyOrders); 
router.put("/order/:id/deliver", protect, deliverOrder);
router.get(
  "/middleman/orders",
  protect,
  getMyMiddlemanOrders
);
module.exports = router;