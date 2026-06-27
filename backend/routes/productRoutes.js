const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { farmerOnly } = require("../middleware/roleMiddleware");
const { createProduct, getProducts, getMyProducts } = require("../controllers/productController");

// Farmer adds product (protected)
router.post(
  "/products",
  protect,
  farmerOnly,
  createProduct
);

// Anyone can view products
router.get("/products", getProducts);

router.get(
  "/my-products",
  protect,
  farmerOnly,
  getMyProducts
);

module.exports = router;
