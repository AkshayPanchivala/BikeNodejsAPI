const asyncHandler = require("express-async-handler");
const AppError = require('../arrorhandler/Apperror');
const BikeType=require('./../module/biketype.model');

//////////////////
// create Bike type
const createBikeType=asyncHandler(async(req,res,next)=>{
        const {bikeType}=req.body
        let missingValues = [];
        if (!bikeType) missingValues.push("Bike Type");;
        if (missingValues.length > 0) {
          return next(
            new AppError(
              `required missing values : ${missingValues.join(" and ")} is neccessary to be filled`,
              400
            )
          );
        }
        const existbiketype=await BikeType.find({Biketype:bikeType});
        if(existbiketype.length>0){
            return next(new AppError('Already bike type is exist',403));
        }
        const biketype=await BikeType.create({Biketype:bikeType});
        res.status(201).json({
            status:'success',
            data:biketype
        })
})




/////////////////////////////////////
//get all biketype
const getAllBikeType=asyncHandler(async(req,res,next)=>{
        const alltype=await BikeType.find();
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


module.exports={createBikeType,getAllBikeType};