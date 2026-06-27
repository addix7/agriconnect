const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  registerMiddleman,
  getMiddlemen,
  transferToMiddleman,
  getMyStock,
  getAllStock
} = require("../controllers/middlemanController");

// only logged user can become middleman
router.post("/middleman", protect, registerMiddleman);

// view all middlemen
router.get("/middlemen", getMiddlemen);

// transfer stock
router.post(
  "/transfer",
  protect,
  transferToMiddleman
);

router.get("/my-stock", protect, getMyStock);

router.get("/stock", protect, getAllStock);

module.exports = router;  