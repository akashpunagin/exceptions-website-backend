const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const {
  isAllowedVolunteerEmailExists,
  addAllowedVolunteerEmails,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.post(
    "/volunteers/add",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { email } = req.body;

        const isExists = await isAllowedVolunteerEmailExists(email);
        if (isExists) {
          return res.status(401).json({ error: "Email exists" });
        }

        const data = await addAllowedVolunteerEmails(email);

        return res
          .status(200)
          .json({ message: "Volunteer email added successfully", data });
      } catch (error) {
        console.log("ADD Volunteer email error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
