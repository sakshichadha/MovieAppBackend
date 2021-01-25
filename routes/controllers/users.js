const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const Bus = require("../../models/Bus");
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
exports.findBus=async(req,res)=>{

const {origin, destination}=req.body
try {
    
const  buses=await Bus.find({origin:origin, destination:destination})
return res.json(buses)

} catch (error) {
    
    console.log(error.message);
    res.status(500).send("Server Error");

}



}