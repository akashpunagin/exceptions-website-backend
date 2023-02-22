const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");

module.exports = (router) => {
  router.get("/get-coordinators", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { users, userRole, userPermission } = appConstants.SQL_TABLE;

    try {
      const getRes = await pool.query(
        `SELECT u.user_id, u.email, u.contact_number, u.first_name, u.last_name
            FROM
              ${users} as u,
              ${userRole} as ur,
              ${userPermission} as up
            WHERE 
              u.user_id = ur.user_id AND
              ur.user_id = up.user_id AND
              ur.role_coordinator = true
            `
      );
      let data = getRes.rows;

      data = data.map((row) => {
        return {
          userId: row.user_id,
          email: row.email,
          contactNumber: row.contact_number,
          firstName: row.first_name,
          lastName: row.last_name,
        };
      });

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET All coordinator error", error);
      return res.status(500).json("Server error");
    }
  });
};
