const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get("/get-all-users-participants", async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { users, userRole, userPermission, participantDetails } =
      appConstants.SQL_TABLE;

    try {
      const getRes = await pool.query(
        `SELECT *
            FROM
              ${users} as u,
              ${userRole} as ur,
              ${userPermission} as up,
              ${participantDetails} as pd
            WHERE 
              u.user_id = ur.user_id AND
              ur.user_id = up.user_id AND
              u.user_id = pd.user_id
            `
      );
      const data = getRes.rows;

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET All users error", error);
      return res.status(500).json("Server error");
    }
  });
};
