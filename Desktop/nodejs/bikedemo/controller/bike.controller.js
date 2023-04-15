const AppError = require('../arrorhandler/Apperror');
const Bike=require('./../module/bike.model');
const BikeType=require('./../module/biketype.model');


////////////////////////////////////
//create bike


const createbike=async(req,res,next)=>{
    try{
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
          return next(new AppError("This product type does not exists", 400));
        } else {
            BikeTypeID = typeExists._id;
        }
     console.log(BikeTypeID);
     const existingbike=await Bike.findOne({name:name});
     console.log(existingbike);
     if(existingbike){
        return next(new AppError('Already bike is exist',400));
     }
        const bike=await Bike.create({name:req.body.name, price:req.body.price, BikeTypeID: BikeTypeID});

        res.status(201).json({
            status:'success',
            data:bike
        })
    }catch(err){
        next(new AppError(err,500));
    }
   
};


////////////////////////////////////////////////
/// getallbike

const gateallbike=async(req,res,next)=>{
    try{
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
    }catch(err){
        next(new AppError(err,404));
    }
   
}


///////////////////////////////////////////////
///deletebike

const deletebike=async(req,res,next)=>{
    try{
        if(!req.params.id){
            return next(new AppError("Id is not exist", 400));
        }
        const bike=await Bike.findByIdAndRemove(req.params.id);
        if(!bike){
            next(new AppError('Bike is not a found',404));
        }
        res.status(204).json({
            status:'success',
            data:null
        })
    }catch(err){
        next(new AppError(err,404));
    }
   
}


/////////////////////////////////////////////////////
//updatebike

const updatebike=async(req,res,next)=>{
    
    try{
        if(!req.params.id){
            return next(new AppError("Id is not exist", 400));
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
    }catch(err){
        next(new AppError('Bike is not a found',404));
    }
   
}

////////////////////////////////////////////////
///get bike by type

const getbikebytype=async (req,res,next)=>{
    try{

        const biketype=await BikeType.find({Biketype:req.params.biketype});
        
        if(!biketype){
            next(new AppError('biketype is not available',404));
        }
       
        const biketypeid=biketype[0]._id;
      
        const bike=await Bike.find({BikeTypeID: biketypeid});
        
        if(bike.length==0){
        next(new AppError('bike not available by this type',400))
        }else{
            
            res.status(200).json({
                status:'success',
                data:bike,
                
            })
        }
        
    }catch(err){
        next(new AppError('bike not available by this type',404));
    }
}


//////////////////////////////////
//get letest bike
const recentbike=async(req,res,next)=>{
    try{
    const bike=await Bike.findOne().sort({createdAt:-1});
    
    if(!bike){
        next(new AppError('Bike is not a found',404));
    }
    res.status(200).json({
        status:'success',
        data:bike
    });
}catch(err){
    next(new AppError('Bike is not a found',404));
}
}




module.exports={createbike,gateallbike,deletebike,updatebike,getbikebytype,recentbike}