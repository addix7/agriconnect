const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/agriconnect")
  .then(() =>console.log("mongodb connected"))
  .catch((err)=>console.error(err));


const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use("/", orderRoutes);
app.use("/", productRoutes);


app.use("/", userRoutes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
