const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.post(
    "/get-user-by-id",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { users, userRole, participantDetails } = appConstants.SQL_TABLE;

      try {
        const { userId } = req.body;

        const isUserExists = await isUserExistsByUserId(userId);

        if (!isUserExists) {
          return res.status(401).json({ error: "User does not exists" });
        }

        const getRes = await pool.query(
          `SELECT *
            FROM
              ${users} as u,
              ${userRole} as ur
            WHERE 
              u.user_id = ur.user_id AND
              u.user_id = $1
            `,
          [userId]
        );
        const data = getRes.rows[0];
        const isRoleParticipant = data.role_participant;

        const userData = {
          userId: data.user_id,
          email: data.email,
          contactNumber: data.contact_number,
          firstName: data.first_name,
          lastName: data.last_name,
        };

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
            [userId]
          );
          const getParticipantData = getParticipantRes.rows[0];
          const {
            college_name: collegeName,
            state,
            city,
            zip,
          } = getParticipantData;
          const participantDetailsJson = { state, city, zip, collegeName };

          return res.status(200).json({
            ...userData,
            participantDetails: participantDetailsJson,
          });
        }

        return res.status(200).json(userData);
      } catch (error) {
        console.log("GET User by id error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
