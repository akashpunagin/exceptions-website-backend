const { authorization } = require("../../../middleware/exportMiddlewares");
const { getLongEventDetails } = require("../../../scripts/getLongEventDetails");

module.exports = (router) => {
  router.get("/get-open-events", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      let data = await getLongEventDetails();
      data = data.filter((event) => event.isOpenEvent);

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Open Events error", error);
      return res.status(500).json("Server error");
    }
  });
};
