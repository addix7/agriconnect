const Middleman = require("../models/Middleman");

// REGISTER MIDDLEMAN
const registerMiddleman = async (req, res) => {
  try {
    const { region, storageCapacity, commissionPercent } = req.body;

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
    res.status(500).json({ error: error.message });
  }
};

// GET ALL MIDDLEMEN
const getMiddlemen = async (req, res) => {
  const middlemen = await Middleman.find().populate("user", "name role");
  res.json(middlemen);
};

module.exports = {
  registerMiddleman,
  getMiddlemen
};
