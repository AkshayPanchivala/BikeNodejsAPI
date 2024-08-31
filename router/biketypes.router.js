const express=require('express');

const {createBikeType,getAllBikeType}=require('../controller/biketype.controller');
const { protect }=require('./../controller/auth.controller');

const router=express.Router();

router.use(protect);
//create biketype and get bike type
router.route('/').post(createBikeType).get(getAllBikeType);


module.exports=router;
