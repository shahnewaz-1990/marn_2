/** @format */

const express = require("express");
const {
  createProduct,
  getProducts,
  setSold,
  allProducts,
  addProduct,
} = require("../controllers/sellerProductController");
const router = new express.Router();

router.post("/seller/product", createProduct);

router.post("/seller/getProducts", getProducts);

router.patch("/seller/setSold", setSold);

router.get("/seller/allProducts", allProducts);

router.get("/seller/addProduct/:id", addProduct);

module.exports = router;
