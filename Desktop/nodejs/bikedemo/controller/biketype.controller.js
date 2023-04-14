const AppError = require('../arrorhandler/Apperror');
const BikeType=require('./../module/biketype.model');



//////////////////
// create Bike type
const createbiketype=async(req,res,next)=>{
    try{
    
        const biketype=await BikeType.create(req.body);
        
        res.status(201).json({
            status:'success',
            data:biketype
        })
    }catch(err){
        next( new AppError('something went wrong in create bike type in biketype controller',404))
    }
   

}




/////////////////////////////////////
//get all biketype
const getallbiketype=async(req,res,next)=>{
    try{
        const alltype=await BikeType.find();
        res.status(200).json({
            status:'success',
            data:alltype
        })
    }catch{
        next (new AppError('something went wrong in get all bike type in biketype controller',404));
    }
}






module.exports={createbiketype,getallbiketype};