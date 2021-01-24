const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

app.use(express.json());
app.use("/api/users", require("./routes/api/users"));

app.use("/api/admin", require("./routes/api/admin"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER STARTED ON 5000`));
