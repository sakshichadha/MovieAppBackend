const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/users", require("./routes/api/users"));

app.listen(PORT, () => console.log(`SERVER STARTED ON 5000`));
