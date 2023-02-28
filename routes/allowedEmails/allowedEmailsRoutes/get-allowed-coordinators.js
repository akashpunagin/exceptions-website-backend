const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getAllowedCoordinatorEmails,
} = require("../../../dbUtils/allowedEmails/dbAllowedEmailsUtils");

module.exports = (router) => {
  router.get("/get-allowed-coordinators", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const data = await getAllowedCoordinatorEmails();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET User by id error:", error);
      return res.status(500).json("Server error");
    }
  });
};
