const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const middlemanRoutes = require("./routes/middlemanRoutes");


const app = express();

app.use(cors());

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
app.use("/", middlemanRoutes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
