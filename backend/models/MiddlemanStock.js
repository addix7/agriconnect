const mongoose = require("mongoose");

const middlemanStockSchema = new mongoose.Schema(
  {
    middleman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Middleman",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    priceAtTransfer: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["stored", "sold"],
      default: "stored",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MiddlemanStock", middlemanStockSchema);
