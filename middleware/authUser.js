const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    jwt.verify(token, config.get("jwtSecret"), async (error, decoded) => {
      if (error) {
        
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        try {
          const findUser = await User.findById(decoded._id);
          if (findUser) {
            req.user = findUser;
            next();
          } else res.status(401).json({ error: "Not authorized!" });
        } catch (error) {
          res.status(500).json({ msg: "Server Error" });
        }
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
