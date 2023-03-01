const { authorization } = require("../../../../middleware/exportMiddlewares");
const {
  getAllowedVolunteerEmails,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.get("/volunteers/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const data = await getAllowedVolunteerEmails();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Volunteer email error:", error);
      return res.status(500).json("Server error");
    }
  });
};
