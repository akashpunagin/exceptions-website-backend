const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const {
  isAllowedCoordinatorEmailExists,
  deleteAllowedCoordinatorsEmails,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.post(
    "/coordinators/delete",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { email } = req.body;

        const isExists = await isAllowedCoordinatorEmailExists(email);
        if (!isExists) {
          return res.status(401).json({ error: "Email does not exists" });
        }

        const data = await deleteAllowedCoordinatorsEmails(email);

        return res
          .status(200)
          .json({ message: "Coordinator email deleted successfully", data });
      } catch (error) {
        console.log("DELETE Coordinator email error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
