const { authorization } = require("../../../middleware/exportMiddlewares");
const { getLongEventDetails } = require("../../../scripts/getLongEventDetails");

module.exports = (router) => {
  router.get("/get-long", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const data = await getLongEventDetails();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Event-Short error", error);
      return res.status(500).json("Server error");
    }
  });
};
