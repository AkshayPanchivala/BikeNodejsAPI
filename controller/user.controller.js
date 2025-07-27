const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const User = require('./../module/user.model');
const AppError = require('./../arrorhandler/Apperror')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address (unique)
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109cc"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         password: "password123"
 *         createdAt: "2023-01-01T12:00:00Z"
 *         updatedAt: "2023-01-01T12:00:00Z"
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the user's password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, missing required fields or invalid data
 *       403:
 *         description: Password and confirm password do not match
 *       409:
 *         description: User with this email already exists
 */
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

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *       400:
 *         description: Bad request, missing required fields
 *       403:
 *         description: Incorrect username or password
 *       404:
 *         description: User not found
 */
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