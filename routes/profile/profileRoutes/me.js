const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/me", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { users, userRole, participantDetails } = appConstants.SQL_TABLE;

    try {
      const currentUser = req.user;

      const getRes = await pool.query(
        `SELECT *
          FROM
            ${users} as u,
            ${userRole} as ur
          WHERE 
            u.user_id = ur.user_id AND
            u.user_id = $1
          `,
        [currentUser.userId]
      );
      const data = getRes.rows[0];
      const isRoleParticipant = data.role_participant;

      if (isRoleParticipant) {
        const getParticipantRes = await pool.query(
          `SELECT *
            FROM
              ${users} as u,
              ${participantDetails} as pd
            WHERE 
              u.user_id = pd.user_id AND
              u.user_id = $1
            `,
          [currentUser.userId]
        );
        const getParticipantData = getParticipantRes.rows[0];
        const {
          college_name: collegeName,
          usn,
          state,
          city,
          zip,
        } = getParticipantData;
        const participantDetailsJson = { usn, state, city, zip, collegeName };

        return res
          .status(200)
          .json({ ...currentUser, ...participantDetailsJson });
      }

      return res.status(200).json(currentUser);
    } catch (error) {
      console.log("PROFILE ERROR", error);
      return res.status(500).json("Server error");
    }
  });
};
