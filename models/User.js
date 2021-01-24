const mongoose = require("mongoose");
const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ticketHistory: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Ticket",
  },
});
module.exports = User = mongoose.model("user", UserModel);
