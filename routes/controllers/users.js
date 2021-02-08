const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const Movie = require("../../models/Movie");
const Ticket = require("../../models/Ticket");

//fetch a user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// register user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "movie operator already exists" }] });
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

// login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

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

// find buses for a given origin and destination
exports.findMovie = async (req, res) => {
  // const { origin, destination } = req.body;
  try {
    const movies = await Movie.find({});

    return res.json(movies);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//find a particular bus
exports.findMovieById = async (req, res) => {
  const { movie, date } = req.body;

  try {
    const bookedTickets = await Ticket.find({
      movie: movie,
      date: date,
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

//book a Ticket
exports.bookTicket = async (req, res) => {
  const { seat, movie, date, name, email, phone } = req.body;
  const ticket = new Ticket({
    name: name,
    email: email,
    phone: phone,
    seat: seat,
    movie: movie,
    date,
    user: req.user.id,
  });
  await ticket.save();
  return res.json(ticket);
};

//cancel a ticket
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

//fetch all booked tickets by a user
exports.myTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id });
    const results = [];
    tickets.map(async (ticket) => {
      try {
        const fetchBus = await Movie.findById(ticket.movie);
        const result = {
          id: ticket._id,
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

//Helper function for my tickets
const resultPush = async (result, results) => {
  await results.push(result);
};
