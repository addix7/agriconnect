const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    cropName: {
      type: String,
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

    location: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
