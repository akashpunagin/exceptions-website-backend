const pool = require("../../../../db/pool");
const authorization = require("../../../../middleware/authorization");
const appConstants = require("../../../../constants/appConstants");

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
        role_coordinator: roleCoordinator,
        role_volunteer: roleVolunteer,
        role_participant: roleParticipant,
      } = roles;

      let role = null;

      if (roleAdmin) {
        role = "ADMIN";
      }
      if (roleCoordinator) {
        role = "COORDINATOR";
      }
      if (roleVolunteer) {
        role = "VOLUNTEER";
      }
      if (roleParticipant) {
        role = "PARTICIPANT";
      }

      return res.status(200).json({ role });
    } catch (error) {
      console.error("Error while getting role", error);
      res.status(500).json("Server error");
    }
  });
};
