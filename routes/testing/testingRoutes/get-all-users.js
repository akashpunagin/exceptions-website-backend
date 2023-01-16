const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get(
    "/get-all-users",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { users, userRole, userPermission } = appConstants.SQL_TABLE;

      try {
        const getRes = await pool.query(
          `SELECT *
            FROM
              ${users} as u,
              ${userRole} as ur,
              ${userPermission} as up
            WHERE 
              u.user_id = ur.user_id AND
              ur.user_id = up.user_id
            `
        );
        const data = getRes.rows;

        return res.status(200).json(data);
      } catch (error) {
        console.log("GET All users error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
