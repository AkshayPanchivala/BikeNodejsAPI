const express=require('express');
const { protect }=require('./../controller/auth.controller');
const router=express.Router();
const {createbike,gateallbike,deletebike,updatebike,getbikebytype,recentbike}=require('../controller/bike.controller')
router.route('/').post(  protect,createbike).get(protect,gateallbike);
router.route('/recentbike').get(protect,recentbike);
router.route('/:id').patch(protect,updatebike).delete(protect,deletebike);
router.route('/:biketype').get(protect,getbikebytype);

module.exports=router;