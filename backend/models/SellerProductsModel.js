const mongoose = require("mongoose");

const sellerProductsSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
    },
    image: {
      type: Array,
    },
    sold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SellerProduct = mongoose.model("SellerProduct", sellerProductsSchema);
module.exports = SellerProduct;
