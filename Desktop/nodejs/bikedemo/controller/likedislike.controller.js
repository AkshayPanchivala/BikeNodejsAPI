const AppError=require('./../arrorhandler/Apperror')
const Like=require('./../module/like.model')
const DisLike=require('./../module/dislike.model');
const Bike=require('./../module/bike.model');




const like=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const bike=await Bike.findById(id);
        
        if(!bike){
            return next(new AppError("Bike is not found",404));
        }
    
       await DisLike.findOneAndDelete({
        user_id: req.user.id,
        Bike_id: id,
       })
     
       const existinglike=await Like.findOne({
        user_id: req.user.id,
        Bike_id: id,
       })
       if(existinglike){
        return next(new AppError("you are already like this product",400));
       }
       const like=await Like.create({
        user_id: req.user.id,
        Bike_id:id,
       })
       res.status(400).json({
        status:'success',
        msg:"successfully liked this bike"
       })
    }catch(err){
        return next(new AppError("some thing went wrong in like controller",404));
    }

};
const dislike=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const bike=await Bike.findById(id);

        if(!bike){
            return next(new AppError("Bike is not found",404));
        }

       await Like.findOneAndDelete({
       
        user_id: req.user.id,
        Bike_id: id,
       })

       const existingdislike=await DisLike.findOne({
        user_id: req.user.id,
        Bike_id: id,
       })
       if(existingdislike){
        return next(new AppError("you Have already dislike this product",400));
       }
       const dislike=await DisLike.create({
        user_id: req.user.id,
        Bike_id: id,
       })
       res.status(400).json({
        status:'success',
        msg:"successfully disliked this bike"
       })
    }catch(err){
        return next(new AppError("some thing went wrong in dislike controller",404));
    }
};



const MostLikedProduct=async(req,res,next)=>{
    
    const likedbike = await Like.aggregate([
      {
        $group: {
          _id: "$Bike_id",
          count: { $sum: 1 }, // counting no. of documents pass
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
      
    ]).exec();
    console.log(likedbike);
  const bike=likedbike[0]
  const mostlikedbike=await Bike.findById(bike._id);
 
    // console.log(mostlikedbike);
    if (mostlikedbike) {
      res.json({
        output: mostlikedbike,
      });
    } else {
      return next(new AppError("Something went wrong", 500));
    }
  };




module.exports={like,dislike,MostLikedProduct}