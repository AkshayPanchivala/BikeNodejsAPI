const jwt = require("jsonwebtoken");
const User = require("./../module/user.model");
const AppError = require("../arrorhandler/Apperror");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.jwt_secretkey);
    const freshuser = await User.findById(decoded._id);
   
    if (!freshuser) next(new AppError("you are not log in", 401));
    req.user = freshuser;
    next();
  } catch (err) {
    next(new AppError("you are not log in", 401));
  }
};
module.exports = { protect };
