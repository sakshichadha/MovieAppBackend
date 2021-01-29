const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const Bus = require("../../models/Bus");
const Ticket = require("../../models/Ticket");

//Fetch a user
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

//Find a particular bus
exports.findBusById = async (req, res) => {
  const { bus, date } = req.body;
  try {
    const bookedTickets = await Ticket.find({
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

//Book a Ticket
exports.bookTicket = async (req, res) => {
  const { seat, bus, date, name, email, phone } = req.body;
  const ticket = new Ticket({
    name: name,
    email: email,
    phone: phone,
    seat: seat,
    bus: bus,
    date,
    user: req.user.id,
  });
  await ticket.save();
  return res.json(ticket);
};

//Cancel a ticket
exports.cancelTicket = async (req, res) => {
  const { id } = req.body;

  try {
    await Ticket.findByIdAndDelete(id);

    return res.json(id);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//Fetch all booked tickets by a user
exports.myTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id });
    const results = [];
    tickets.map(async (ticket) => {
      try {
        const fetchBus = await Bus.findById(ticket.bus);
        const result = {
          id: ticket._id,
          origin: fetchBus.origin,
          destination: fetchBus.destination,
          startTime: fetchBus.startTime,
          endTime: fetchBus.endTime,
          date: ticket.date,
          seat: ticket.seat,
        };

        await resultPush(result, results);
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
      }
    });
    setTimeout(function () {
      return res.json(results);
    }, 1000);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//Helper function for myTickets
const resultPush = async (result, results) => {
  await results.push(result);
};
