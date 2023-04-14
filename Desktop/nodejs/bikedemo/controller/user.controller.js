const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');



const User=require('./../module/user.model');
const AppError=require('./../arrorhandler/Apperror')



////////////////////////////////////////////////////////////
//user register

const register=(async(req,res,next)=>{
    try{
    

        const user=await User.create(req.body);

        res.status(201).json({
            status:'success',
            data:user
        })
    }catch(err){
         next(new AppError('something went wrong in register type in user controller',404));

    }

});


//////////////////////////////////////////////////////////////
//user login

const login=(async(req,res,next)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        if(!email || !password){
            next (new AppError('provide email or password',400))
        }
        const user=await User.findOne({email:email});
        
        if(!user){

            next(new AppError(`can't find user`,404));
          
        }else{
            const passwordexist=bcrypt.compare(password,user.password);
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
            }}
        
    }catch(err){
        next(new AppError('something went wrong in login type in user controller',404));

    }
});






module.exports={register,login};