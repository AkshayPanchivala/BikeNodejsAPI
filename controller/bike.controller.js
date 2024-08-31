const asyncHandler = require("express-async-handler");
const AppError = require("../arrorhandler/Apperror");
const Like = require("../module/like.model");
const Bike = require("./../module/bike.model");
const BikeType = require("./../module/biketype.model");
const Dislike = require("./../module/dislike.model");
const Comment = require("./../module/comment.model");
const mongoose = require("mongoose");

////////////////////////////////////
//create Bike

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

////////////////////////////////////////////////
/// getallbike

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

///////////////////////////////////////////////
///deletebike

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

/////////////////////////////////////////////////////
//updatebike

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

////////////////////////////////////////////////
///get bike by type

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

//////////////////////////////////
//get letest bike
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


//get all bike with pagination
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
