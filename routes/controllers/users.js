const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const Bus = require("../../models/Bus");
const Tickets = require("../../models/Ticket");
const { format } = require("prettier");
const Ticket = require("../../models/Ticket");

const formatDate = (date) => {
  return new Intl.DateTimeFormat().format(new Date(date));
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Bus operator already exists" }] });
    }

    let ticketHistory = [];
    user = new User({
      name,
      email,
      password,
      ticketHistory,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // const isMatch = await bcrypt.compare(password, user.password);

    if (password != user.password) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Find Buses for a given origin and destination
exports.findBus = async (req, res) => {
  const { origin, destination } = req.body;
  try {
    const buses = await Bus.find({ origin: origin, destination: destination });
    return res.json(buses);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

exports.findBusById = async (req, res) => {
  const { bus, date } = req.body;
  try {
    const bookedTickets = await Tickets.find({
      bus: bus,
      date: date + "T00:00:00.000Z",
    });
    let vacantSeats = Array(40).fill(1);

    bookedTickets.map((ticket) => {
      vacantSeats[ticket.seat - 1] = 0;
    });
    return res.json(vacantSeats);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

exports.bookTicket = async (req, res) => {
  const { seat, bus, date,name,email,phone } = req.body;
  const ticket = new Ticket({
    name:name,
    email:email,
    phone:phone,
    seat: seat,
    bus: bus,
    date,
    user: req.user.id,
  });
  console.log(ticket)
  await ticket.save();
  return res.json(ticket);
};

exports.myTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id });

    return res.json(tickets);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
