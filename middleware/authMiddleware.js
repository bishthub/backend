const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  console.log("🚀 ~ file: authMiddleware.js:5 ~ verifyToken ~ t̥oken:", token);

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, "YOUR_SECRET");
    req.user = verified;
    next();
  } catch (error) {
    console.log("HEREEEE");
    res.status(400).send("Invalid Token");
  }
};

module.exports = verifyToken;
