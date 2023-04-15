const Bike = require('../module/bike.model');
const Comments = require('../module/comment.model');
const AppError=require('./../arrorhandler/Apperror');


const comment=async(req,res,next) => {
    try{
        
            const id = req.params.id;
            const bike = await Bike.findById(id);
            console.log(bike);
            if (!bike) {
              return next(new AppError("bike does not exists", 404));
            }
          if(!req.body.comment){
            return next(new AppError("please add a comment", 404));
          }
         
            const created = await Comments.create({
                user_id: req.user.id,
                Bike_id: req.params.id,
                comment: req.body.comment,
              });
              
            if (created) {
              res.status(201).json({
                msg: "Comment Added Successfully",
              });
            } 
          
    }catch(err){
        next(new AppError(err, 500));
    }
    
}
module.exports=comment
