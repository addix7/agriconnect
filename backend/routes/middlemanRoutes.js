const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { registerMiddleman, getMiddlemen } = require("../controllers/middlemanController");

// only logged user can become middleman
router.post("/middleman", protect, registerMiddleman);

// view all middlemen
router.get("/middlemen", getMiddlemen);

module.exports = router;
