const express=require('express');
const { protect }=require('./../controller/auth.controller');
const {createbike,gateallbike,deletebike,updatebike,getbikebytype,recentbike}=require('../controller/bike.controller')
const {like,dislike,MostLikedProduct}=require('./../controller/likedislike.controller')
const comment=require('./../controller/comment.controller');

const router=express.Router();


//create bike routes
router.route('/').post(  protect,createbike).get(protect,gateallbike);

//recent bike routes
router.route('/recentbike').get(protect,recentbike);


// getMostLiked product route 
router.route("/mostlikedproduct").get( protect,MostLikedProduct);



// like routes
router.route("/likeProduct/:id").post( protect,like);
// Dislike routes
router.route("/dislikeProduct/:id").post( protect,dislike);

// comment route
router.route("/comment/:id").post( protect,comment);

//update bike
router.route('/:id').patch(protect,updatebike).delete(protect,deletebike);

//get bike by biketype
router.route('/:biketype').get(protect,getbikebytype);
module.exports=router;