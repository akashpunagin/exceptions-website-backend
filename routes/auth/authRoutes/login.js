const pool = require("../../../db/pool");
const bcrypt = require("bcrypt");
const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../../../utilities/jwtGenerator");
const validateInputs = require("../../../middleware/validateInputs");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.post("/login", validateInputs, async (req, res) => {
    console.log("Route:", req.path);

    const { users } = appConstants.SQL_TABLE;

    try {
      // destructure req body
      const { email, password } = req.body;

      // check if user doesnt exist if not throw error
      const usersRes = await pool.query(
        `SELECT * FROM ${users}
            WHERE email = $1`,
        [email]
      );

      if (usersRes.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "Email or Password is incorrect" });
      }

      // if exists check if incoming password matches db password
      const user = usersRes.rows[0];

      // check password valid
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Password is incorrect" });
      }

      // check if user email is verified
      if (user.is_verified === false) {
        // send user details if account is not verified
        return res.status(401).json({
          error: "Email not verified yet",
          user: {
            userId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
          },
        });
      }

      // return jwt token
      const accessToken = accessTokenGenerator(user);
      const refreshToken = refreshTokenGenerator(user);

      // save refresh token in users database
      await pool.query(
        `UPDATE ${users}
            SET refresh_token = $1
            WHERE user_id = $2`,
        [refreshToken, user.user_id]
      );

      return res.json({ accessToken, refreshToken });
    } catch (error) {
      console.error("Error while logging in", error);
      res.status(500).json("Server error");
    }
  });
};
