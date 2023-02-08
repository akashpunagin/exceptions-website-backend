const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get("/get-available-team-names", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamNames } = appConstants.SQL_TABLE;

    try {
      const teamNamesRes = await pool.query(`
        SELECT * 
        FROM ${teamNames}
        WHERE ${teamNames}.id NOT IN (
          SELECT team_name_id
          FROM ${teamMaster}
        )
      `);
      const data = teamNamesRes.rows;

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Team name error", error);
      return res.status(500).json("Server error");
    }
  });
};
