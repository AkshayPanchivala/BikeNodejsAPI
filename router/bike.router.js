const express = require('express');
const { protect } = require('./../controller/auth.controller');
const { createBike, gatAllBike, deletebike, updatebike, getbikebytype, recentbike, getAllBikeWithPagination } = require('../controller/bike.controller')
const { like, dislike, MostLiked } = require('./../controller/likedislike.controller')
const comment = require('./../controller/comment.controller');

const router = express.Router();

router.use(protect);
//create bike and Get all Bike 
router.route('/').post(createBike).get(gatAllBike);
router.route("/getbikewithpagination").get(getAllBikeWithPagination);
//recent bike routes
router.route('/recentbike').get(recentbike);
// getMostLiked product route 
router.route("/mostlikedbike").get(MostLiked);
// like routes
router.route('/likebike/:id').post(like);
// Dislike routes
router.route("/dislikebike/:id").post(dislike);
// comment route
router.route("/comment/:id").post(comment);
//update bike and delete bike
router.route('/:id').put(updatebike).delete(deletebike);
//get bike by biketype
router.route('/:biketype').get(getbikebytype);


module.exports = router;