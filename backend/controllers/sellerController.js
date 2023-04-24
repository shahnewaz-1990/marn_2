const Seller = require("../models/SellerModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dfn9t2jzq",
  api_key: "898433798731585",
  api_secret: "-EsUKcV-pLnOzlHf87b4cSMaGF4",
});

const createSeller = async (req, res) => {
  try {
    const seller = new Seller(req.body);
    await seller.save();
    res.status(201).send(seller);
  } catch (err) {
    // Handle errors and send error response to client
    res.status(500).json({
      message: err.message,
    });
  }
};

const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    if (!sellers) {
      return res.status(400).send("No Sellers");
    }
    res.status(200).send(sellers);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getSeller = async (req, res) => {
  try {
    const user = await Seller.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(400).send("User Not Found");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const changeProfile = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Seller.findOne({ email });

    if (!user) {
      return res.send("User Not Found");
    }

    // Upload profile image to Cloudinary
    console.log(req.files);
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

    // Update user's profile image URL in database
    user.avatar = imageUrls[0];
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const deleteSeller = async (req, res) => {
  try {
    const id = req.body.id;
    const seller = await Seller.findByIdAndDelete(id);
    if (!seller) {
      return res.status(400).send("No Seller Found");
    }
    res.send("Deleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const editSeller = async (req, res) => {
  try {
    const { id, name, lastName, email } = req.body;
    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(400).send("Seller Not Found");
    }
    seller.name = name;
    seller.lastName = lastName;
    seller.email = email;

    const updatedSeller = await seller.save();
    res.status(200).send(updatedSeller);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  createSeller,
  getSeller,
  changeProfile,
  getAllSellers,
  deleteSeller,
  editSeller,
};
