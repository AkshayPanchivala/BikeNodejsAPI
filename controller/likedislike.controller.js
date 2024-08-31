const asyncHandler = require("express-async-handler");
const AppError = require('./../arrorhandler/Apperror')
const Like = require('./../module/like.model')
const DisLike = require('./../module/dislike.model');
const Bike = require('./../module/bike.model');
const Comments = require("../module/comment.model");

///////////////////////////////////////////
/////create like

const like = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bike = await Bike.findById(id);
  if (!bike) {
    return next(new AppError("Bike is not found", 404));
  }

  const existinglike = await Like.findOne({
    user_id: req.user.id,
    Bike_id: id,
  })
  if (existinglike) {
    return next(new AppError("you are already like this product", 400));
  }
  const deletedislike = await DisLike.findOneAndDelete({
    user_id: req.user.id,
    Bike_id: id,
  })
  const like = await Like.create({
    user_id: req.user.id,
    Bike_id: id,
  })
  res.status(400).json({
    status: 'success',
    msg: "successfully liked this bike"
  })
});


//////////////////////////////////////////////////////
////create dislike
const dislike = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bike = await Bike.findById(id);
  if (!bike) {
    return next(new AppError("Bike is not found", 404));
  }
  const existingdislike = await DisLike.findOne({
    user_id: req.user.id,
    Bike_id: id,
  })

  if (existingdislike) {
    return next(new AppError("you Have already dislike this product", 400));
  }
  const deletelike = await Like.findOneAndDelete({
    user_id: req.user.id,
    Bike_id: id,
  })
  const dislike = await DisLike.create({
    user_id: req.user.id,
    Bike_id: id,
  })

  res.status(400).json({
    status: 'success',
    msg: "successfully disliked this bike"
  })
});


//////////////////////////////////////////////////
///get most liked product
const MostLiked = asyncHandler(async (req, res, next) => {

  const likedbike = await Like.aggregate([
    {
      $group: {
        _id: "$Bike_id",
        count: { $sum: 1 }, // counting no. of documents pass
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    }, {
      $skip: 4
    }

  ]).exec();

  if (likedbike.length == 0) {
    return next(new AppError("Not found any like on bike", 404));
  }

  const bike = likedbike[0]

  const mostlikedbike = await Bike.findById(bike._id);
  const comment = await Comments.find({ Bike_id: bike._id });

  let commentarray = [];
  for (let i = 0; i < comment.length; i++) {
    commentarray.push(comment[i].comment);
  }
  if (mostlikedbike) {
    res.json({
      mostlikedbike: mostlikedbike,
      count: likedbike[0].count,
      comment: commentarray
    });
  } else {
    return next(new AppError("Bike is not found", 404));
  }
});


module.exports = { like, dislike, MostLiked }