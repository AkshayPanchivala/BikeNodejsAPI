const asyncHandler = require("express-async-handler");
const AppError = require('../arrorhandler/Apperror');
const Bike=require('./../module/bike.model');
const BikeType=require('./../module/biketype.model');


////////////////////////////////////
//create bike


const createbike=asyncHandler(async(req,res,next)=>{
    
        let  BikeTypeID;
        
        const typeExists = await BikeType.findOne({  Biketype: req.body.bikeType });
        
        const { name, bikeType,price} = req.body;

  let missingValues = [];

  if (!name) missingValues.push("Name ");
  if (!bikeType) missingValues.push("bikeType");
  if (!price) missingValues.push("price");
 

  if (missingValues.length > 0) {
    return next(
      new AppError(
        `required missing values : ${missingValues} is neccessary to be filled`,
        400
      )
    );
  }
        if (!typeExists) {
          return next(new AppError("This product type does not exists", 401));
        } else {
            BikeTypeID = typeExists._id;
        }
   
     const existingbike=await Bike.findOne({name:name});
    
     if(existingbike){
        return next(new AppError('Already bike is exist',403));
     }
        const bike=await Bike.create({name:req.body.name, price:req.body.price, BikeTypeID: BikeTypeID});

        res.status(201).json({
            status:'success',
            data:bike
        })
    
});


////////////////////////////////////////////////
/// getallbike

const gateallbike=asyncHandler(async(req,res,next)=>{

        const bike=await Bike.find();
        if(bike.length==0){
            return res.status(200).json({
                status:'success',
                message:'No data found'
            })
        }
        res.status(200).json({
            status:'success',
            data:bike
        })
   
   
})


///////////////////////////////////////////////
///deletebike

const deletebike=asyncHandler(async(req,res,next)=>{
    
        if(!req.params.id){
            return next(new AppError("Id is not exist", 404));
        }
        const bike=await Bike.findByIdAndRemove(req.params.id);
        if(!bike){
            next(new AppError('Bike is not a found',404));
        }
        res.status(204).json({
            status:'success',
            data:null
        })
   
   
})


/////////////////////////////////////////////////////
//updatebike

const updatebike=asyncHandler(async(req,res,next)=>{
    
  
        if(!req.params.id){
            return next(new AppError("Id is not exist", 400));
        }
        if(!req.body)
            {
                return next(new AppError("body is not exist", 400));
            }
           if((req.params.id).length<24 ||(req.params.id).length>24 ){
            next(new AppError('Bike is not a found',404));
           }
            
            
                
             
        const bike=await Bike.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bike){
            next(new AppError('Bike is not a found',404));
        }
        res.status(200).json({
            status:'success',
            data:bike
        })
    
   
})

////////////////////////////////////////////////
///get bike by type

const getbikebytype=asyncHandler(async (req,res,next)=>{
  

        const biketype=await BikeType.find({Biketype:req.params.biketype});
        
        if(!biketype){
            next(new AppError('biketype is not available',404));
        }
       
        const biketypeid=biketype[0]._id;
      
        const bike=await Bike.find({BikeTypeID: biketypeid});
        
        if(bike.length==0){
        return next(new AppError('bike not available by this type',404))
        }
            
            res.status(204).json({
                status:'success',
                data:null,
                
            })
        
        
   
})


//////////////////////////////////
//get letest bike
const recentbike=asyncHandler(async(req,res,next)=>{
    
    const bike=await Bike.findOne().sort({createdAt:-1});
    
    if(!bike){
        next(new AppError('Bike is not a found',404));
    }
    res.status(200).json({
        status:'success',
        data:bike
    });

})




module.exports={createbike,gateallbike,deletebike,updatebike,getbikebytype,recentbike}