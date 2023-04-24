const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sellerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
sellerSchema.statics.findByCredentials = async (email, password) => {
  const user = await Seller.findOne({ email });
  if (!user) {
    throw new Error("User Not Found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("No User Found");
  }

  return user;
};

sellerSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
