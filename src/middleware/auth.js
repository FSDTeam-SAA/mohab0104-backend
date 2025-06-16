const config = require("../config");
const { verifyToken } = require("../utilts/tokenGenerate");

const auth = (...roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const verifiedUser = verifyToken(token, config.JWT_SECRET);
      if (!verifiedUser) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }
      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "You are not authenticated",
      });
    }
  };
};

module.exports = auth;
