const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');



const User=require('./../module/user.model');
const AppError=require('./../arrorhandler/Apperror')
const asyncHandler = require("express-async-handler");


////////////////////////////////////////////////////////////
//user register

const register=asyncHandler(async(req,res,next)=>{
    
        const { name, email, password, confirmpassword} = req.body;

        let missingValues = [];
      
        if (!name) missingValues.push("Name ");
        if (!email) missingValues.push("Email ");
        if (!password) missingValues.push("password ");
        if (!confirmpassword) missingValues.push("confirmpassword ");
      
        if (missingValues.length > 0) {
          return next(
            new AppError(
              `required missing values : ${missingValues} is neccessary to be filled`,
              400
            )
          );
        }
       
        if(password!==confirmpassword){
            return next(new AppError('Password and confirmpassword are not matching',404));
        }

        if(typeof(password)!='string'||typeof(confirmpassword)!='string'){
            return next(new AppError('confirm password or password is incorrect',404));
        }
        const existuser=await User.find({email:email});
        if(existuser.length>0){
            return next(new AppError('Already user is exist',400));
        }
        const user=await User.create(req.body);

        res.status(201).json({
            status:'success',
            data:user
        })


});


//////////////////////////////////////////////////////////////
//user login

const login=asyncHandler(async(req,res,next)=>{
   
        const email=req.body.email;
        const password=req.body.password;
        if(!email || !password){
            next (new AppError('provide email or password',400))
        }
        const user=await User.findOne({email:email});
        
        if(!user){

            next(new AppError(`can't find user`,404));
          
        }else{
            if(typeof(password)!='string'){
                return next(new AppError('username or password is incorrect',404));
            }
            const passwordexist=await bcrypt.compare(password,user.password);
           
            if(passwordexist)
           
            {
                const token=jwt.sign({_id:user._id},process.env.jwt_secretkey,{
                    expiresIn:process.env.jwt_expirydate
                })
            res.status(200).json({
                status:'success',
                data:user,
                token:token
            })
            }else{
                return next(new AppError('username or password is incorrect',404));
            }
        }
        
   
});






module.exports={register,login};