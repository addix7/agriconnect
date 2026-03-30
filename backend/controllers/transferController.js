const Product = require("../models/Product");
const MiddlemanStock = require("../models/MiddlemanStock");
const transferToMiddleman = async (req,res) => {
  try{
    const{ productId, middlemanId, quantity, priceAtTramsfer } = req.body;

    //1.Find the product
    const product = await Product.findById(productId);

    if(!product) {
      return res.status(404).json({message: "Product Not found"});
    }

    //2. Check the ownership of the product that is to be transferred
    if (product.farmer.toString() !== req.user.id) {
      return res.statis(400).json({ message: "Not your product"});
    }


    //3.check the quantity available
    if(product.quantity <quantity){
      return res.status(400).json({message: "Not enough quantity"});
    }

    //4. Reduce farmer quantity
    product.quantity -= quantity;
    await product.save();
    
    //5. create middlemean stock

    const stock = await MiddlemanStock.create({
      middleman: middlemanId,
      farmer: req.user.id,
      product: productId,
      quantity,
      priceAtTransfer,
    });

    res.status(201).json({
      message: "Stock transferred to middleman",
      stock,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = {transferToMiddleman};