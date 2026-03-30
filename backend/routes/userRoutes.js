// routes/userRoutes.js

const express = require("express");
const protect = require("../middleware/auth");
const router = express.Router();


const {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// CREATE
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// READ
router.get("/users", protect, getUsers);

// UPDATE
router.put("/users/:id", protect, updateUser);

// DELETE
router.delete("/users/:id",protect, deleteUser);



module.exports = router;
