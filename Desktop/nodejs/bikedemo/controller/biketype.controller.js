const AppError = require('../arrorhandler/Apperror');
const BikeType=require('./../module/biketype.model');
const asyncHandler = require("express-async-handler");


//////////////////
// create Bike type
const createbiketype=asyncHandler(async(req,res,next)=>{
    
        
        if(!req.body.Biketype || typeof(req.body.Biketype)!='string'){
            return next(new AppError('bike type is not defined',400));
        }
        
        const existbiketype=await BikeType.find({Biketype:req.body.Biketype});
        if(existbiketype.length>0){
            return next(new AppError('Already bike type is exist',400));
        }
        const biketype=await BikeType.create({Biketype:req.body.Biketype});
        
        res.status(201).json({
            status:'success',
            data:biketype
        })
   

})




/////////////////////////////////////
//get all biketype
const getallbiketype=asyncHandler(async(req,res,next)=>{
    
        const alltype=await BikeType.find();
        
        console.log(alltype.length);
        if(alltype.length==0){
            return res.status(200).json({
                status:'success',
                message:'No data found'
            })
           
        }
        res.status(200).json({
            status:'success',
            data:alltype
        })
    }
)






module.exports={createbiketype,getallbiketype};