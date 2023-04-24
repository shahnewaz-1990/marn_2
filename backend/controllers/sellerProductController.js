/** @format */

const SellerProduct = require("../models/SellerProductsModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dfn9t2jzq",
  api_key: "898433798731585",
  api_secret: "-EsUKcV-pLnOzlHf87b4cSMaGF4",
});
const createProduct = async (req, res) => {
  try {
    // Upload all files to Cloudinary
    const uploadPromises = Object.values(req.files).map(async (file) => {
      console.log(file);
      const { name, data } = file;
      try {
        // Write the binary data to a file on your local machine
        const filePath = `./${name}`;
        await fs.promises.writeFile(filePath, data);

        // Upload the file to Cloudinary and get the URL
        const result = await cloudinary.uploader.upload(filePath);
        console.log("Uploaded image to Cloudinary:", result.secure_url);

        // Delete the file from your local machine
        await fs.promises.unlink(filePath);

        return result.secure_url;
      } catch (err) {
        console.log("Error uploading image to Cloudinary:", err);
        throw err;
      }
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Create new SellerProduct object with image URLs
    const product = new SellerProduct({
      ...req.body,
      image: imageUrls,
    });

    await product.save();
    res.status(200).send(product);
  } catch (err) {
    // Handle errors and send error response to client
    res.status(500).json({
      message: err.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const userId = req.body.userId;
    const products = await SellerProduct.find({ userId });
    if (!products) {
      throw new Error("No Products");
    }
    res.send(products);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const setSold = async (req, res) => {
  try {
    const productId = req.body.id;
    const product = await SellerProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.sold = !product.sold;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const allProducts = async (req, res) => {
  try {
    const products = await SellerProduct.find({ sold: false });
    if (!products) {
      throw new Error("No Products");
    }
    res.send(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const addProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await SellerProduct.findById(id);
    if (!product) {
      throw new Error("No Product Found!");
    }
    res.send(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  setSold,
  allProducts,
  addProduct,
};
