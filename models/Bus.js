const mongoose = require("mongoose");
const BusModel = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
});
module.exports = Bus = mongoose.model("bus", BusModel);
