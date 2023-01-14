const pool = require("../../../db/pool");
const authorization = require("../../../middleware/authorization");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/my-role", authorization, async (req, res) => {
    try {
      const { users, userRole } = appConstants.SQL_TABLE;

      const userAdminsRes = await pool.query(
        `SELECT u.user_id, ur.*
        FROM ${users} AS u, ${userRole} as ur
        WHERE u.user_id = ur.user_id AND
          u.user_id = $1
        `,
        [req.user.userId]
      );

      if (userAdminsRes.rowCount === 0) {
        return res.status(401).json({ error: "User does not exists" });
      }

      const roles = userAdminsRes.rows[0];

      const {
        role_admin: roleAdmin,
        role_customer: roleCustomer,
        role_tenant: roleTenant,
      } = roles;

      let role = null;

      if (roleAdmin) {
        role = "ADMIN";
      }
      if (roleCustomer) {
        role = "CUSTOMER";
      }
      if (roleTenant) {
        role = "TENANT";
      }

      return res.status(200).json({ role });
    } catch (error) {
      console.error("Error while verifying", error);
      res.status(500).json("Server error");
    }
  });
};
