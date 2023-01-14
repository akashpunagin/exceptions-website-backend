const pool = require("../../../db/pool");
const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../../../utilities/jwtGenerator");
const authorizeRefreshToken = require("../../../middleware/authorizeRefreshToken");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.post("/refresh-token", authorizeRefreshToken, async (req, res) => {
    console.log("Route:", req.path);

    const { users } = appConstants.SQL_TABLE;

    try {
      // req.isVerified and req.user is set by middleware
      if (req.isVerified === true) {
        const { refreshToken: oldRefreshToken } = req.body;

        const refreshTokenRes = await pool.query(
          `SELECT refresh_token
              FROM ${users}
              WHERE refresh_token = $1`,
          [oldRefreshToken]
        );

        if (refreshTokenRes.rowCount === 0) {
          return res.status(401).json({ error: "No user found" });
        }

        const dbRefreshToken = refreshTokenRes.rows[0].refresh_token;

        // check if refresh token from user db matches with incomming refresh token
        if (dbRefreshToken !== oldRefreshToken) {
          return res
            .status(401)
            .json({ error: "Invalid refresh token for this user" });
        }

        const accessToken = accessTokenGenerator(req.user);
        const newRefreshToken = refreshTokenGenerator(req.user);

        // save refresh token in users database
        await pool.query(
          `UPDATE ${users}
              SET refresh_token = $1
              WHERE user_id = $2`,
          [newRefreshToken, req.user.user_id]
        );

        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
      }
    } catch (error) {
      console.error("Refresh token error", error);
      res.status(500).send("Server error");
    }
  });
};
