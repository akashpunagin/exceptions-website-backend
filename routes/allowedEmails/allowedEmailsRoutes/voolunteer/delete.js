const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const {
  isAllowedVolunteerEmailExists,
  deleteAllowedVolunteersEmails,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.post(
    "/volunteers/delete",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { email } = req.body;

        const isExists = await isAllowedVolunteerEmailExists(email);
        if (!isExists) {
          return res.status(401).json({ error: "Email does not exists" });
        }

        const data = await deleteAllowedVolunteersEmails(email);

        return res
          .status(200)
          .json({ message: "Volunteers email deleted successfully", data });
      } catch (error) {
        console.log("DELETE Volunteer email error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
