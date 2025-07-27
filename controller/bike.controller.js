const asyncHandler = require("express-async-handler");
const AppError = require("../arrorhandler/Apperror");
const Like = require("../module/like.model");
const Bike = require("./../module/bike.model");
const BikeType = require("./../module/biketype.model");
const Dislike = require("./../module/dislike.model");
const Comment = require("./../module/comment.model");
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Bike:
 *       type: object
 *       required:
 *         - name
 *         - bikeTypeId
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the bike
 *         name:
 *           type: string
 *           description: The name of the bike
 *         bikeTypeId:
 *           type: string
 *           description: The ID of the bike type
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the bike
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked the bike
 *         dislikes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who disliked the bike
 *         comments:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of comment IDs for the bike
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the bike was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the bike was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109cc"
 *         name: "Mountain Bike Pro"
 *         bikeTypeId: "60d0fe4f5311236168a109cb"
 *         price: 1200.00
 *         likes: []
 *         dislikes: []
 *         comments: []
 *         createdAt: "2023-01-01T12:00:00Z"
 *         updatedAt: "2023-01-01T12:00:00Z"
 */

/**
 * @swagger
 * /user/bike:
 *   post:
 *     summary: Create a new bike
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - bikeTypeId
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the bike
 *               bikeTypeId:
 *                 type: string
 *                 description: The ID of the bike type
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the bike
 *     responses:
 *       201:
 *         description: Bike created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Bike'
 *       400:
 *         description: Bad request, missing required fields or invalid data
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Bike with this name already exists
 *       404:
 *         description: Bike type not found
 */
const createBike = asyncHandler(async (req, res, next) => {
  const { name, bikeTypeId, price } = req.body;
  let missingValues = [];

  if (!name || typeof name == "number") missingValues.push("Name");
  if (!bikeTypeId || typeof bikeTypeId == "number") missingValues.push("BikeType");
  if (!price || typeof price == "string") missingValues.push("Price");

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values : ${missingValues.join(" And ")} is neccessary to be filled`,
        400
      )
    );
  }
  let BikeTypeID;
  const typeExists = await BikeType.findById(bikeTypeId);
  if (!typeExists)
    return next(new AppError("This product type does not exists", 401));
  else
    BikeTypeID = typeExists._id;

  const existingbike = await Bike.findOne({ name: name });
  if (existingbike)
    return next(new AppError("Already bike is exist", 403));

  const bike = await Bike.create({
    name,
    price,
    BikeTypeID: BikeTypeID,
  });

  res.status(201).json({
    status: "success",
    data: bike,
  });
});

/**
 * @swagger
 * /user/bike:
 *   get:
 *     summary: Get all bikes
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of bikes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: No data found
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bike'
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
const gatAllBike = asyncHandler(async (req, res, next) => {
  const bike = await Bike.find()
    .populate({
      path: "likes",
      select: "user_id -Bike_id -_id",
    }).populate({
      path: "likescount",
    })
    .populate({
      path: "dislikes",
      select: "user_id -Bike_id -_id",
    }).populate({
      path: "dislikescount",
    })
    .populate({
      path: "comments",
      select: "comment  -Bike_id -_id",
    }).populate({
      path: "commentscount",
    })
    .populate({
      path: "commentscount",
    });


  if (!bike.length) {
    return res.status(200).json({
      status: "success",
      message: "No data found",
    });
  }

  res.status(200).json({
    status: "success",
    data: bike,
  });
});

/**
 * @swagger
 * /user/bike/{id}:
 *   delete:
 *     summary: Delete a bike by ID
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bike to delete
 *     responses:
 *       200:
 *         description: Bike deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Bike'
 *       400:
 *         description: Bad request, ID is missing
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Bike not found
 */
const deletebike = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("Id is not exist", 404));
  }

  const bike1 = await Bike.findById(req.params.id);
  if (!bike1) {
    return next(new AppError("Bike is not a found", 404));
  }
  Promise.all([Like.deleteMany({ Bike_id: req.params.id }), Dislike.deleteMany({ Bike_id: req.params.id }), Comment.deleteMany({ Bike_id: req.params.id })]).then(() => {
    console.log('all deleted');
  });

  const bike = await Bike.findByIdAndRemove(req.params.id);
  res.status(200).json({
    status: "success",
    data: bike,
  });
});

/**
 * @swagger
 * /user/bike/{id}:
 *   put:
 *     summary: Update a bike by ID
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bike to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bike'
 *     responses:
 *       200:
 *         description: Bike updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Bike'
 *       400:
 *         description: Bad request, ID is missing or invalid data
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Bike not found or invalid bike ID
 */
const updatebike = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("Id is not exist", 400));
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    next(new AppError("please provide valid bike id.", 404));
  }
  // const bike=await Bike.findByIdAndUpdate(req.params.id,req.body,{
  //     new:true,
  //     runValidators:true
  // });
  const bike = await Bike.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bike) {
    next(new AppError("Bike is not a found", 404));
  }
  res.status(200).json({
    status: "success",
    data: bike,
  });
  
});

/**
 * @swagger
 * /user/bike/{biketype}:
 *   get:
 *     summary: Get bikes by bike type
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: biketype
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the bike type
 *     responses:
 *       200:
 *         description: A list of bikes of the specified type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bike'
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: Bike type not found or no bikes found for this type
 */
const getbikebytype = asyncHandler(async (req, res, next) => {
  const biketype = await BikeType.find({ Biketype: req.params.biketype });

  if (!biketype) {
    next(new AppError("biketype is not available", 404));
  }

  const biketypeid = biketype[0]._id;

  const bike = await Bike.find({ BikeTypeID: biketypeid });

  if (bike.length == 0) {
    return next(new AppError("bike not available by this type", 404));
  }

  res.status(200).json({
    status: "success",
    data: bike,
  });
});

const recentbike = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const perPage = req.query.limit * 1 || 3;

  const bikePage = await Bike.paginate(
    {},
    { page: page, limit: perPage, sort: { createdAt: -1 } })

  res.status(200).json({
    bike: bikePage,
    totalBike: bikePage.totalDocs,
    prevpage: bikePage.prevPage,
    nextpage: bikePage.nextPage
  });
});

const getAllBikeWithPagination = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const perPage = req.query.limit * 1 || 2;
  const bike = await Bike.find().count();
  const totalpages = Math.floor(bike / perPage);
  const temp = await Bike.aggregate([
    {
      $skip: (page - 1) * perPage

    }, {
      $limit: perPage
    }
  ]);

  res.status(200).json({
    temp: temp,
    total: bike.length,
    prevpage: page - 1,
    nextpage: page + 1,
    totalpages: totalpages
  },
  );
});


module.exports = {
  createBike,
  gatAllBike,
  deletebike,
  updatebike,
  getbikebytype,
  recentbike,
  getAllBikeWithPagination,
};



module.exports = {
  createBike,
  gatAllBike,
  deletebike,
  updatebike,
  getbikebytype,
  recentbike,
  getAllBikeWithPagination,
};
