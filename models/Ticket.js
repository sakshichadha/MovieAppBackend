const mongoose = require("mongoose");
const TicketModel = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = Ticket = mongoose.model("ticket", TicketModel);
