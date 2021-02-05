const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
connectDB();

app.use(express.json());
app.use("/api/users", require("./routes/api/users"));

app.use("/api/admin", require("./routes/api/admin"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server connected on 5000`));
