const express = require("express");
const {
  createSeller,
  getSeller,
  changeProfile,
  getAllSellers,
  deleteSeller,
  editSeller,
} = require("../controllers/sellerController");
const router = new express.Router();

router.post("/user/seller", createSeller);
router.post("/user/getSeller", getSeller);
router.post("/user/changeProfile", changeProfile);
router.get("/user/getAllUsers", getAllSellers);
router.delete("/user/deleteSeller", deleteSeller);
router.put("/user/editSeller", editSeller);
module.exports = router;
