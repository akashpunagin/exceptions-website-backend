const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  updateRefreshToken,
} = require("../../../dbUtils/app_varchar_constants/dbAppVarcharConstantsUtils");

module.exports = (router) => {
  router.post(
    "/update-g-drive-refresh-token",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { refreshToken } = req.body;

        await updateRefreshToken(refreshToken);

        return res.status(200).json({
          message: "g-drive-refresh-token updated successfully",
        });
      } catch (error) {
        console.log("UPDATE g-drive-refresh-token error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
