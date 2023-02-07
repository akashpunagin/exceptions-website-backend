const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  // TODO add auth admin
  router.post("/add", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamNames } = appConstants.SQL_TABLE;

    try {
      const { label } = req.body;

      const teamNamesRes = await pool.query(
        `SELECT * FROM ${teamNames}
          WHERE label = $1`,
        [label]
      );
      const teamNamesCount = teamNamesRes.rowCount;

      if (teamNamesCount > 0) {
        return res.status(401).json({ error: "Team name already exists" });
      }

      const teamNamesAddRes = await pool.query(
        `INSERT INTO ${teamNames}(label)
        VALUES ($1)
        RETURNING *`,
        [label]
      );
      const data = teamNamesAddRes.rows;

      return res.status(200).json(data);
    } catch (error) {
      console.log("ADD Team name error", error);
      return res.status(500).json("Server error");
    }
  });
};
