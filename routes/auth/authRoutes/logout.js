const pool = require("../../../db/pool");
const authorization = require("../../../middleware/authorization");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.post("/logout", authorization, async (req, res) => {
    const { users } = appConstants.SQL_TABLE;

    try {
      // remove refresh token in users database
      await pool.query(
        `UPDATE ${users}
            SET refresh_token = NULL
            WHERE user_id = $1`,
        [req.user.userId]
      );
      return res.status(200).json({ message: "Logged out successfuly" });
    } catch (error) {
      console.error("Logout error", error);
      res.status(500).send("Server error");
    }
  });
};
