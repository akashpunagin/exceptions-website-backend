const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const {
  deleteAllowedAdminEmails,
  isAllowedAdminEmailExists,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.post(
    "/admins/delete",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { email } = req.body;

        const isExists = await isAllowedAdminEmailExists(email);
        if (!isExists) {
          return res.status(401).json({ error: "Email does not exists" });
        }

        const data = await deleteAllowedAdminEmails(email);

        return res
          .status(200)
          .json({ message: "Admin email deleted successfully", data });
      } catch (error) {
        console.log("DELETE admin email error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
