const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//Routers
const authRouter = require("./routes/auth/authRouter");
const profileRouter = require("./routes/profile/profileRouter");

const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(PORT, async () => {
  console.log(`Listening to port ${PORT}`);
});

module.exports = app;
