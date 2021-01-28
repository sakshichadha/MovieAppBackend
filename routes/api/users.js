const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const authUser = require("../../middleware/auth/authUser");
const authCommon = require("../../middleware/auth/authCommon");
const {
  registerUser,
  loginUser,
  findBus,
  getUser,
  findBusById,
  bookTicket,
  myTickets,
} = require("../controllers/users");

router.get("/", authUser, getUser);

//Register a new user
router.post("/register", registerUser);

//Login a new user
router.post("/login", loginUser);

module.exports = router;

//View All Buses
router.post("/findBus", authCommon, findBus);

router.post("/getBusById", authCommon, findBusById);

router.post("/bookTicket", authUser, bookTicket);

router.get("/myTickets", authUser, myTickets);
