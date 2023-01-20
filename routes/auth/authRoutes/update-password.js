const pool = require("../../../db/pool");
const validateInputs = require("../../../middleware/validateInputs");
const appConstants = require("../../../constants/appConstants");
const {
  passwordResetJwtSecretGenerator,
} = require("../../../utilities/jwtGenerator");
const jwt = require("jsonwebtoken");
const { generateBcryptPassword } = require("./funcGenerateBcryptPassword");

module.exports = (router) => {
  router.post("/update-password", validateInputs, async (req, res) => {
    console.log("ROUTE:", req.path);

    const { users } = appConstants.SQL_TABLE;

    try {
      const { userId, jwtToken } = req.query;
      const { newPassword } = req.body;

      const getUserRes = await pool.query(
        `SELECT u.user_id, u.first_name, u.last_name, u.email, u.password, u.created_at
          FROM ${users} AS u
          WHERE user_id = $1`,
        [userId]
      );

      if (getUserRes.rowCount === 0) {
        return res.status(401).json({ error: "User does not exist" });
      }

      const userData = getUserRes.rows[0];
      const { password: passwordHash, created_at: createdAt } = userData;

      const jwtSecret = passwordResetJwtSecretGenerator(
        passwordHash,
        createdAt
      );
      const payload = jwt.verify(jwtToken, jwtSecret);
      const userIdFromPayload = payload.userId;

      if (userIdFromPayload !== userId) {
        return res.status(403).json({ error: "Not Authorized" });
      }

      const bcryptPassword = await generateBcryptPassword(newPassword);

      const updateRes = await pool.query(
        `UPDATE users
        SET password = $1
        WHERE user_id = $2
        RETURNING *`,
        [bcryptPassword, userId]
      );
      if (updateRes.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "Error while updating user's password" });
      }

      return res.status(200).json({
        message: "Sent Password reset email successfully",
        user: { userId },
      });
    } catch (error) {
      console.error("Error while updating password", error);
      return res.status(500).json("Server error");
    }
  });
};
