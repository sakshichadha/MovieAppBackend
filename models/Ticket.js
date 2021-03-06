//ticket schema
const mongoose = require("mongoose");
const TicketModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  seat: {
    type: Number,
    required: true,
  },
});
module.exports = Ticket = mongoose.model("ticket", TicketModel);
