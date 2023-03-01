const { authorization } = require("../../../../middleware/exportMiddlewares");
const {
  getAllowedAdminEmails,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.get("/admins/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const data = await getAllowedAdminEmails();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Admin email error:", error);
      return res.status(500).json("Server error");
    }
  });
};
