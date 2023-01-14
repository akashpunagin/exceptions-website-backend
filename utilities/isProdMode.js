require("dotenv").config();

function isProdMode() {
  const mode = process.env.MODE;

  if (mode === "prod") {
    return true;
  } else {
    return false;
  }
}

module.exports = isProdMode;
