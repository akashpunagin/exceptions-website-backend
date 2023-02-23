const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getRefreshToken,
} = require("../../../dbUtils/app_varchar_constants/dbAppVarcharConstantsUtils");

module.exports = (router) => {
  router.get(
    "/get-g-drive-refresh-token",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const refreshToken = await getRefreshToken();

        return res.status(200).json({ refreshToken });
      } catch (error) {
        console.log("GET get-max-gc-member-size error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
