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

//get a user from db
router.get("/", authUser, getUser);

//register a new user
router.post("/register", registerUser);

//login a new user
router.post("/login", loginUser);

//view All buses
router.post("/findBus", authCommon, findBus);

//fetch a bus by its id
router.post("/getBusById", authCommon, findBusById);

//book a ticket
router.post("/bookTicket", authUser, bookTicket);

//get tickets booked by user
router.get("/myTickets", authUser, myTickets);

//cancel a booked ticket
router.post("/cancelTicket", authUser, cancelTicket);

module.exports = router;
