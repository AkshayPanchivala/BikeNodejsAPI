const express=require('express');
const router=express.Router();
const {register,login}=require('./../controller/user.controller')



///user register
router.route('/register').post(register);


//user login
router.route('/login').post(login);

module.exports=router;
