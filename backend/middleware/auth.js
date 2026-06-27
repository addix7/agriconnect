const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
   const authHeader = req.headers.authorization;
   
   if (!authHeader) {
    return res.status(401).json({
      message: "No token, access denied"
    });
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, "SECRETKEY");
  
    req.user = decoded; // store user info

    next(); // allow request to continue

  } catch (error) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = protect;
