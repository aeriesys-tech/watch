// const jwt = require("jsonwebtoken");
// const db = require("../models");

// const authMiddleware = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     console.log("No token provided.");
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   try {
//     console.log("Token received:", token);

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token:", decoded);

//     // Check if the token exists in the database and is not expired
//     const userToken = await db.UserToken.findOne({
//       where: {
//         token,
//         user_id: decoded.id,
//       },
//     });

//     if (!userToken) {
//       console.log("Token not found in database.");
//       return res.status(401).json({ error: "Invalid or expired token." });
//     }

//     const currentDate = new Date();
//     const expireDate = new Date(userToken.expire_at);

//     if (currentDate > expireDate) {
//       console.log("Token expired.");
//       return res.status(401).json({ error: "Token expired." });
//     }

//     console.log("Token valid.");
//     // Attach user info to request object
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error.message);
//     res.status(400).json({ error: "Invalid token." });
//   }
// };

// module.exports = authMiddleware;
const jwt = require("jsonwebtoken");
const db = require("../models");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    console.log("Token received:", token);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Check if the token exists in the database and is not expired
    const userToken = await db.UserToken.findOne({
      where: {
        token,
        user_id: decoded.id,
      },
    });

    if (!userToken) {
      console.log("Token not found in database.");
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const currentDate = new Date();
    const expireDate = new Date(userToken.expire_at);

    if (currentDate > expireDate) {
      console.log("Token expired.");
      return res.status(401).json({ error: "Token expired." });
    }

    console.log("Token valid.");
    
    // Attach user info to response locals
    req.user = decoded;
    res.locals.user = decoded; // Store the decoded user data in res.locals
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
