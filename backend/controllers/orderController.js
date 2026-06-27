const Order = require("../models/Order");
const MiddlemanStock = require("../models/MiddlemanStock");

const placeOrder = async (req, res) => {
  try {
    const { middlemanStockId, quantity, price } = req.body;

    // 1. find stock
    const stock = await MiddlemanStock.findById(middlemanStockId);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // 2. check quantity
    if (stock.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // 3. reduce stock

    // 4. create order
    const order = await Order.create({
      company: req.user.id,
      middlemanStock: middlemanStockId,
      quantity,
      price
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== "pending") {
  return res.status(400).json({
    message: "Order already processed"
  }); 
}

    const stock = await MiddlemanStock.findById(order.middlemanStock);

    if (!stock) {
      return res.status(404).json({
        message: "Stock not found"
      });
    }

    if (stock.quantity < order.quantity) {
      return res.status(400).json({
        message: "Not enough stock available"
      });
    }

    stock.quantity -= order.quantity;
    await stock.save();

    order.status = "confirmed";
    await order.save();

    res.status(200).json({
      message: "Order confirmed",
      order
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

const rejectOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== "pending") {
  return res.status(400).json({
    message: "Order already processed"
  });
}

    order.status = "rejected";

    await order.save();

    res.status(200).json({
      message: "Order rejected",
      order
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};


const getOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("company", "name role")
      .populate({
        path: "middlemanStock",
        populate: {
          path: "product",
          select: "cropName"
        }
      });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};;  

const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      company: req.user.id
    })
    .populate("company", "name role")
    .populate({
      path: "middlemanStock",
      populate: [
        {
          path: "product",
          select: "cropName"
        },
        {
          path: "middleman",
          populate: {
            path: "user",
            select: "name"
          }
        }
      ]
    });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};
const deliverOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== "confirmed") {
      return res.status(400).json({
        message: "Only confirmed orders can be delivered"
      });
    }

    order.status = "delivered";

    await order.save();

    res.status(200).json({
      message: "Order delivered",
      order
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

const Middleman = require("../models/Middleman");

const getMyMiddlemanOrders = async (req, res) => {
  try {

    // Find the logged-in middleman
    const middleman = await Middleman.findOne({
      user: req.user.id
    });

    if (!middleman) {
      return res.status(404).json({
        message: "Middleman not found"
      });
    }

    // Find orders only for this middleman's stock
    const orders = await Order.find()
      .populate("company", "name role")
      .populate({
        path: "middlemanStock",
        match: {
          middleman: middleman._id
        },
        populate: {
          path: "product",
          select: "cropName"
        }
      });

    // Remove orders that don't belong to this middleman
    const filteredOrders = orders.filter(
      order => order.middlemanStock !== null
    );

    res.status(200).json(filteredOrders);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

module.exports = {
  placeOrder,
  acceptOrder,
  rejectOrder,
  deliverOrder,
  getOrders,
  getMyOrders,
  getMyMiddlemanOrders
};