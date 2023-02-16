const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getMaxGCMember,
} = require("../../../dbUtils/app_int_constants/dbAppIntConstantsUtils");

module.exports = (router) => {
  router.get("/get-max-gc-member-size", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { appIntConstants } = appConstants.SQL_TABLE;
    const label = "max_gc_member_size";

    try {
      const maxGCMemberSize = await getMaxGCMember();

      return res.status(200).json(maxGCMemberSize);
    } catch (error) {
      console.log("GET get-max-gc-member-size error", error);
      return res.status(500).json("Server error");
    }
  });
};
