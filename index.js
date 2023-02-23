const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

//Routers
const authRouter = require("./routes/auth/authRouter");
const profileRouter = require("./routes/profile/profileRouter");
const eventRouter = require("./routes/event/eventRouter");
const teamRouter = require("./routes/team/teamRouter");
const teamMemberRouter = require("./routes/teamMember/teamMemberRouter");
const appConstantsRouter = require("./routes/appConstants/appConstantsRouter");
const teamNamesRouter = require("./routes/teamNames/teamNamesRouter");
const adminRouter = require("./routes/admin/adminRouter");
const paymentRouter = require("./routes/payment/paymentRouter");

// TODO delete
const testingRouter = require("./routes/testing/testingRouter");

const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/event", eventRouter);
app.use("/team", teamRouter);
app.use("/teamMember", teamMemberRouter);
app.use("/appConstants", appConstantsRouter);
app.use("/teamNames", teamNamesRouter);
app.use("/admin", adminRouter);
app.use("/payment", paymentRouter);

// TODO delete
app.use("/testing", testingRouter);

app.get("/", (req, res) => {
  res.send("API working on exceptions.rvce.edu.in");
});

app.listen(PORT, async () => {
  console.log(`Listening to port ${PORT}`);
});

module.exports = app;

// TODO
//  DONE:: get teams: embed user details in place of head user Id
//  DONE:: get team members of all teams - sort by team id

//  DONE:: from event name(or id) get team and team members

//  DONE:: team member assign to event: validate if event is maxed out

//  DONE:: team names, dont send team names which are already selected

//  DONE:: from team name(or id) get team members, with team head
//  DONE:: team member master: is_present: update true or false

//  DONE:: get coordinators, volunteers, participants - for admin

// > Payments
// DONE:: record transaction id, store is_verified status in database
//// DONE:: check store information in payment table
//// DONE:: firstly check if payment is already done, if true then block the rest of API route
// DONE:: send Verification Done email to participant after verifying

//  authorized emails for admin, coordinators, volunteers

//> DONE: after payment send
// https://docs.google.com/forms/d/e/1FAIpQLScd5vUCTYVm310utaXnrhjzkae58iJ-9QzGXllffT9NO632BA/viewform?usp=sf_link
// this link if team is registered with Solvathon

//> DONE: add telegram link
// https://t.me/exceptions_rvce
// in payment verification

// Present team members
// Absent team members
// CSV file of team members
