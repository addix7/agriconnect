const mongoose = require("mongoose");

const middlemanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    region: {
      type: String,
      required: true
    },

    storageCapacity: {
      type: Number,
      required: true
    },

    commissionPercent: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Middleman", middlemanSchema);
