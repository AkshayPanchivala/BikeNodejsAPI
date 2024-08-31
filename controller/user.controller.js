const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const User = require('./../module/user.model');
const AppError = require('./../arrorhandler/Apperror')

////////////////////////////////////////////////////////////
//user register

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  let missingValues = [];
  if (!name || typeof (name) == 'number') missingValues.push("Name ");
  if (!email || typeof (email) == 'number') missingValues.push("Email ");
  if (!password) missingValues.push("Password ");
  if (!confirmPassword) missingValues.push("ConfirmPassword ");

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values : ${missingValues.join(" and ")} is neccessary to be filled`,
        400
      )
    );
  }

  if (password !== confirmPassword) {
    return next(new AppError('Password and confirmpassword are not matching', 403));
  }

  if (typeof (password) != 'string' || typeof (confirmPassword) != 'string')
    return next(new AppError('confirm password or password is incorrect', 403));

  const existuser = await User.find({ email: email });
  if (existuser.length > 0) {
    return next(new AppError('Already user is exist', 409));
  }
  const user = await User.create(req.body);
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    data: user
  })
});

//////////////////////////////////////////////////////////////
//user login

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  let missingValues = [];
  if (!password) missingValues.push("Password");
  if (!email || typeof (email) == 'number') missingValues.push("Email ");
  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values : ${missingValues.join(" and ")} is neccessary to be filled`,
        400
      )
    );
  }
  const user = await User.findOne({ email: email });
  if (!user)
    next(new AppError(`can't find user`, 404));
  else {
    if (typeof (password) != 'string') {
      return next(new AppError('username or password is incorrect', 403));
    }
    const passwordexist = await bcrypt.compare(password, user.password);
    user.password = undefined;
    if (passwordexist) {
      const token = jwt.sign({ _id: user._id }, process.env.jwt_secretkey, {
        expiresIn: process.env.jwt_expirydate
      })
      res.status(200).json({
        status: 'success',
        data: user,
        token: token
      })
    } else {
      return next(new AppError('username or password is incorrect', 403));
    }
  }
});

module.exports = { register, login };