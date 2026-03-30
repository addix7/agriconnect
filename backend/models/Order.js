const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    middlemanStock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MiddlemanStock",
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);