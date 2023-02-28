const { authorization } = require("../../../middleware/exportMiddlewares");
const {
  getAllTeams,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.get("/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const data = await getAllTeams();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Team error", error);
      return res.status(500).json("Server error");
    }
  });
};
