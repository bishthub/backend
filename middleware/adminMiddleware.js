module.exports = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // user is an admin, continue...
  } else {
    res.status(403).send("Access Denied: You don't have admin rights");
  }
};
