const pool = require("../../../db/pool");
const authorization = require("../../../middleware/authorization");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/is-admin", authorization, async (req, res) => {
    try {
      const { users, userRole } = appConstants.SQL_TABLE;

      const userAdminsRes = await pool.query(
        `SELECT u.user_id, ur.role_admin
        FROM ${users} AS u, ${userRole} as ur
        WHERE u.user_id = ur.user_id AND
          u.user_id = $1
        `,
        [req.user.userId]
      );

      const userAdmins = userAdminsRes.rows;

      if (userAdmins.length === 0) {
        return res.status(401).json({ error: "User does not exists" });
      }

      return res.status(200).json({ isAdmin: userAdmins[0].role_admin });
    } catch (error) {
      console.error("Error while verifying", error);
      res.status(500).json("Server error");
    }
  });
};
