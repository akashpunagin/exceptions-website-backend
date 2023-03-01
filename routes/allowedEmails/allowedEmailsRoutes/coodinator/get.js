const { authorization } = require("../../../../middleware/exportMiddlewares");
const {
  getAllowedCoordinatorEmails,
} = require("../../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.get("/coordinators/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const data = await getAllowedCoordinatorEmails();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Coordinator email error:", error);
      return res.status(500).json("Server error");
    }
  });
};
