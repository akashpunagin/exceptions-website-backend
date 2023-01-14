const authorization = require("../../../middleware/authorization");

module.exports = (router) => {
  router.get("/is-token-valid", authorization, async (req, res) => {
    try {
      res.json(true);
    } catch (error) {
      console.error("Error while verifying", error);
      res.status(500).json("Server error");
    }
  });
};
