const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token not provided or not valid" });
        }
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        req.payload = payload;
        next();
    } catch (error) {
        res.status(401).json("token not provided or not valid");
  }
}

const isAdmin = (req, res, next) => {
    if (req.payload?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

module.exports = {isAuthenticated, isAdmin}