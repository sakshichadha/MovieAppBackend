const mongoose = require("mongoose");
const MovieModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
 
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});
module.exports = Movie = mongoose.model("movie", MovieModel);
