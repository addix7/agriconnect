const Product = require("../models/Product");

// CREATE PRODUCT (farmer adds crop)
const createProduct = async (req, res) => {
  try {
    const { cropName, quantity, price, location } = req.body;

    if (!cropName || !quantity || !price || !location) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const product = await Product.create({
      farmer: req.user.id,   // from token
      cropName,
      quantity,
      price,
      location
    });

    res.status(201).json({
      message: "Product added",
      product
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name role");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {

    const products = await Product.find({
      farmer: req.user.id
    });

    res.status(200).json(products);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

module.exports = {
  createProduct,
  getProducts,
  getMyProducts
};
