const express=require('express');

const { protect }=require('./../controller/auth.controller');
const {createbike,gateallbike,deletebike,updatebike,getbikebytype,recentbike,pagination}=require('../controller/bike.controller')
const {like,dislike,MostLiked}=require('./../controller/likedislike.controller')
const comment=require('./../controller/comment.controller');

const router=express.Router();


router.use(protect);
//create bike routes
router.route('/').post(createbike).get(gateallbike);
router.route("/getbike").get(pagination);
//recent bike routes
router.route('/recentbike').get(recentbike);
// getMostLiked product route 
router.route("/mostlikedBike").get(MostLiked);

// like routes
router.route("/likeBike/:id").post(like);

// Dislike routes
router.route("/dislikeBike/:id").post(dislike);

// comment route
router.route("/comment/:id").post(comment);

//update bike
router.route('/:id').put(updatebike).delete(deletebike);


//get bike by biketype
router.route('/:biketype').get(getbikebytype);


module.exports=router;