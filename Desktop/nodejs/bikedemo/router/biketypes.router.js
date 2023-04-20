const express=require('express');

const {createbiketype,getallbiketype}=require('../controller/biketype.controller');
const { protect }=require('./../controller/auth.controller');

const router=express.Router();

router.use(protect);
//create biketype and get bike type
router.route('/').post(createbiketype).get(getallbiketype);


module.exports=router;
