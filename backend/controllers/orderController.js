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
    stock.quantity -= quantity;
    await stock.save();

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

module.exports = { placeOrder };