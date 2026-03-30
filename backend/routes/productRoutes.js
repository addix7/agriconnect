const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { createProduct, getProducts } = require("../controllers/productController");

// Farmer adds product (protected)
router.post("/products", protect, createProduct);

// Anyone can view products
router.get("/products", getProducts);

module.exports = router;
