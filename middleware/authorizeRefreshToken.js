const jwt = require("jsonwebtoken");
const payloadGenerator = require("./../utilities/payloadGenerator");
require("dotenv").config();

module.exports = async (req, res, next) => {
  console.log("CHECKING REFRESH AUTHORIZATION MIDDLEWARE");
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ error: "Not Authorized" });
    }

    const rawPayload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const payload = payloadGenerator(rawPayload);
    req.user = payload;
    req.isVerified = true;
    next();
  } catch (error) {
    console.error("Refresh token middleware error", error);
    return res.status(403).json({ error: "Not Authorized" });
  }
};
