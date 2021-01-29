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
  cancelTicket,
} = require("../controllers/users");

//Get a user from DB
router.get("/", authUser, getUser);

//Register a new user
router.post("/register", registerUser);

//Login a new user
router.post("/login", loginUser);

//View All Buses
router.post("/findBus", authCommon, findBus);

//Fetch a bus by its Id
router.post("/getBusById", authCommon, findBusById);

//Book a ticket
router.post("/bookTicket", authUser, bookTicket);

//Get tickets booked by user
router.get("/myTickets", authUser, myTickets);

//Cancel a booked ticket
router.post("/cancelTicket", authUser, cancelTicket);

module.exports = router;
