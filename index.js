const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//Routers
const authRouter = require("./routes/auth/authRouter");
const profileRouter = require("./routes/profile/profileRouter");
const eventRouter = require("./routes/event/eventRouter");
const teamRouter = require("./routes/team/teamRouter");
const teamMemberRouter = require("./routes/teamMember/teamMemberRouter");
const appConstantsRouter = require("./routes/app_constants/appConstantsRouter");

// TODO delete
const testingRouter = require("./routes/testing/testingRouter");

const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/event", eventRouter);
app.use("/team", teamRouter);
app.use("/teamMember", teamMemberRouter);
app.use("/appConstants", appConstantsRouter);

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
//  from event name(or id) get team and team members
//  from team name(or id) get team members
//  get coordinators, volunteers, participants - for admin
//  authorized emails for admin, coordinators, volunteers
//  team names, dont send team names which are already selected

// [
//   {
//     teamId: 1,
//     name: "hi",
//     members: [{ team1MemberDetails }, { team1MemberDetails }],
//   },
//   {
//     teamId: 2,
//     members: [{ team1MemberDetails }, { team1MemberDetails }],
//   },
// ];
