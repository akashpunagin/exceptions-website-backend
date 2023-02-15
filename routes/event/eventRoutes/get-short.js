const { authorization } = require("../../../middleware/exportMiddlewares");
const {
  getShortEventDetails,
} = require("../../../scripts/getShortEventDetails");

module.exports = (router) => {
  router.get("/get-short", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const data = await getShortEventDetails();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Event-Short error", error);
      return res.status(500).json("Server error");
    }
  });
};
