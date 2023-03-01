const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const {
  addAllowedAdminEmails,
  isAllowedAdminEmailExists,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.post(
    "/admins/add",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { email } = req.body;

        const isExists = await isAllowedAdminEmailExists(email);
        if (isExists) {
          return res.status(401).json({ error: "Email exists" });
        }

        const data = await addAllowedAdminEmails(email);

        return res
          .status(200)
          .json({ message: "Admin email added successfully", data });
      } catch (error) {
        console.log("Add admin email error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
