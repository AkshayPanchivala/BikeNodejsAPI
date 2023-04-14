const AppError = require('../arrorhandler/Apperror');
const Bike=require('./../module/bike.model');
const BikeType=require('./../module/biketype.model');


////////////////////////////////////
//create bike


const createbike=async(req,res,next)=>{
    try{
        let  BikeTypeID;
        
        const typeExists = await BikeType.findOne({  Biketype: req.body.bikeType });
        
        if (!typeExists) {
          return next(new AppError("This product type does not exists", 400));
        } else {
            BikeTypeID = typeExists._id;
        }
     console.log(BikeTypeID);
        const bike=await Bike.create({name:req.body.name, price:req.body.price, BikeTypeID: BikeTypeID});

        res.status(201).json({
            status:'success',
            data:bike
        })
    }catch(err){
        next(new AppError('something went wrong in create bike in bike controller',404));
    }
   
};


////////////////////////////////////////////////
/// getallbike

const gateallbike=async(req,res,next)=>{
    try{
        const bike=await Bike.find();
        res.status(200).json({
            status:'success',
            data:bike
        })
    }catch(err){
        next(new AppError('something went wrong in gate all bike in bike controller',404));
    }
   
}


///////////////////////////////////////////////
///deletebike

const deletebike=async(req,res,next)=>{
    try{
        const bike=await Bike.findByIdAndRemove(req.params.id);
        if(!bike){
            next(new AppError('Bike is not a found',404));
        }
        res.status(204).json({
            status:'success',
            data:null
        })
    }catch(err){
        next(new AppError('something went wrong in delete bike in bike controller',404));
    }
   
}


/////////////////////////////////////////////////////
//updatebike

const updatebike=async(req,res,next)=>{
    try{
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
        next(new AppError('something went wrong in update bike in bike controller',404));
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
            
        
        next(new AppError('bike not available by this type',404))
        }else{
            
            res.status(200).json({
                status:'success',
                data:bike,
                
            })
        }
        
    }catch(err){
        next(new AppError('something went wrong in get bike by type in bike controller',404));
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
    next(new AppError('something went wrong in recent bike in bike controller',404));
}
}




module.exports={createbike,gateallbike,deletebike,updatebike,getbikebytype,recentbike}