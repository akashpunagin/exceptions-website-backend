const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const {
  isAllowedCoordinatorEmailExists,
  addAllowedCoordinatorEmails,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.post(
    "/coordinators/add",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { email } = req.body;

        const isExists = await isAllowedCoordinatorEmailExists(email);
        if (isExists) {
          return res.status(401).json({ error: "Email exists" });
        }

        const data = await addAllowedCoordinatorEmails(email);

        return res
          .status(200)
          .json({ message: "Coordinator email added successfully", data });
      } catch (error) {
        console.log("ADD Coordinator email error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
