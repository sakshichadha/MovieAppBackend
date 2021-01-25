const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authAdmin = require("../../middleware/auth/authAdmin");
const { registerAdmin, loginAdmin, addBus } = require("../controllers/admin");

router.get("/", authAdmin, async (req, res) => {
  res.send("hii");
});

//Register Admin
router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  registerAdmin
);

//Login Admin
router.post("/login", loginAdmin);

//Add a bus
router.post("/addBus", authAdmin,addBus);

module.exports = router;
