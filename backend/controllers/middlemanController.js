const Middleman = require("../models/Middleman");
const Product = require("../models/Product");
const MiddlemanStock = require("../models/MiddlemanStock");


// REGISTER MIDDLEMAN

const registerMiddleman = async (req, res) => {

  try {

    const {
      region,
      storageCapacity,
      commissionPercent
    } = req.body;

    const middleman = await Middleman.create({

      user: req.user.id,

      region,

      storageCapacity,

      commissionPercent

    });

    res.status(201).json({

      message: "Middleman registered",

      middleman

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// GET ALL MIDDLEMEN

const getMiddlemen = async (req, res) => {

  try {

    const middlemen = await Middleman
      .find()
      .populate("user", "name role");

    res.status(200).json(middlemen);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// TRANSFER STOCK TO MIDDLEMAN

const transferToMiddleman = async (req, res) => {

  try {

    const {
      productId,
      middlemanId,
      quantity,
      priceAtTransfer
    } = req.body;

    // 1. Find product

    const product = await Product.findById(productId);

    if (!product) {

      return res.status(404).json({
        message: "Product not found"
      });

    }

    // 2. Check ownership

    if (product.farmer.toString() !== req.user.id) {

      return res.status(403).json({
        message: "Not your product"
      });

    }

    // 3. Check quantity

    if (product.quantity < quantity) {

      return res.status(400).json({
        message: "Not enough quantity"
      });

    }

    // 4. Reduce farmer quantity

    product.quantity -= quantity;

    await product.save();

    // 5. Create middleman stock

    const stock = await MiddlemanStock.create({

      middleman: middlemanId,

      farmer: req.user.id,

      product: productId,

      quantity,

      priceAtTransfer

    });

    res.status(201).json({

      message: "Stock transferred successfully",

      stock

    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


const getMyStock = async (req, res) => {
  try {

    // Find middleman profile belonging to logged in user
    const middleman = await Middleman.findOne({
      user: req.user.id
    });

    if (!middleman) {
      return res.status(404).json({
        message: "Middleman profile not found"
      });
    }

    // Find stock belonging to that middleman profile
    const stock = await MiddlemanStock.find({
      middleman: middleman._id
    })
    .populate("product", "cropName")
.populate("farmer", "name");

    res.status(200).json(stock);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

const getAllStock = async (req, res) => {
  try {

    const stock = await MiddlemanStock.find()
      .populate("product", "cropName")
      .populate("farmer", "name")
      .populate({
        path: "middleman",
        populate: {
          path: "user",
          select: "name"
        }
      });

    res.status(200).json(stock);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};


module.exports = {

  registerMiddleman,

  getMiddlemen,

  transferToMiddleman,

  getMyStock,

  getAllStock


};