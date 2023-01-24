const pool = require("../../../../db/pool");
const validateInputs = require("../../../../middleware/validateInputs");
const sendConfirmationEmail = require("../../../../utilities/sendConfirmationEmail");
const appConstants = require("../../../../constants/appConstants");
const {
  resetPasswordTokenGenerator,
} = require("../../../../utilities/jwtGenerator");
const sendPasswordResetEmail = require("../../../../utilities/sendPasswordResetEmail");

module.exports = (router) => {
  router.post("/reset-password", validateInputs, async (req, res) => {
    console.log("ROUTE:", req.path);

    const { users, userVerificationTokens } = appConstants.SQL_TABLE;

    try {
      const { email } = req.body;

      const getUserRes = await pool.query(
        `SELECT u.user_id, u.first_name, u.last_name, u.email, u.password, u.created_at
          FROM ${users} AS u
          WHERE email = $1`,
        [email]
      );

      if (getUserRes.rowCount === 0) {
        return res.status(401).json({ error: "User does not exist" });
      }

      const userData = getUserRes.rows[0];
      const {
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
      } = userData;

      const passwordResetToken = resetPasswordTokenGenerator(userData);

      const userFullName = `${firstName} ${lastName}`;
      const isSuccess = await sendPasswordResetEmail(
        userFullName,
        userId,
        email,
        passwordResetToken
      );

      if (!isSuccess) {
        return res
          .status(401)
          .json({ error: "Error while sending password reset email" });
      }
      return res.status(200).json({
        message: "Sent Password reset email successfully",
        user: { userId, firstName, lastName, email },
      });
    } catch (error) {
      console.error("Error while sending confirmation email", error);
      return res.status(500).json("Server error");
    }
  });
};
