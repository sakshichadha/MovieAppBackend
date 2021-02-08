const jwt = require("jsonwebtoken");
const config = require("config");
const Admin = require("../../models/Admin");
const Ticket = require("../../models/Ticket");
const Movie = require("../../models/Movie");

// Register a new Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Movie operator already exists" }] });
    }

    let movies = [];
    admin = new Admin({
      name,
      email,
      password,
      movies,
    });

    await admin.save();

    const payload = {
      user: {
        id: admin.id,
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

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email });

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

// Add a bus
exports.addMovie = async (req, res) => {
  const { startTime, endTime } = req.body;
  try {
    const own = await Admin.findOne({ _id: req.user.id });
    console.log(own);
    movie = new Movie({
      name: own.name,
      owner: req.user.id,
      startTime: startTime,
      endTime: endTime,
    });
    await movie.save();

    res.json({ msg: "Movie added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//get all buses of an admin
exports.getMyMovies = async (req, res) => {
  // const { origin, destination } = req.body;

  try {
    const movies = await Movie.find({
      // origin: origin,
      // destination: destination,
      owner: req.user.id,
    });

    return res.json(movies);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//Get info about a booked ticket
exports.ticketInfo = async (req, res) => {
  const { date, movie, seat } = req.body;
  try {
    const ticket = await Ticket.findOne({
      date: date,
      movie: movie,
      seat: seat,
    });
    return res.json(ticket);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//Cancel all Tickets of a bus
exports.cancelTickets = async (req, res) => {
  const { date, movie } = req.body;
  try {
    await Ticket.deleteMany({ date: date, movie: movie });
    res.json({ msg: "All Booking Removed Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};
