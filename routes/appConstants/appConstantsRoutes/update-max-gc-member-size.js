const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.post(
    "/update-max-gc-member-size",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { appIntConstants } = appConstants.SQL_TABLE;
      const label = "max_gc_member_size";

      try {
        const { memberSize: maxGCMemberSize } = req.body;

        const intConstantsRes = await pool.query(
          `UPDATE ${appIntConstants}
          SET value = $2
          WHERE label = $1
          RETURNING *`,
          [label, maxGCMemberSize]
        );
        const data = intConstantsRes.rows[0];

        return res
          .status(200)
          .json({ message: "Max GC Member Size updated successfully" });
      } catch (error) {
        console.log("GET get-max-gc-member-size error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
