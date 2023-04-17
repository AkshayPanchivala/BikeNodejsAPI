const asyncHandler = require("express-async-handler");

const Bike = require('../module/bike.model');
const Comments = require('../module/comment.model');
const AppError=require('./../arrorhandler/Apperror');

////////////////////////////////////////////////////
//create comment
const comment=asyncHandler(async(req,res,next) => {
    
        
            const id = req.params.id;
            const bike = await Bike.findById(id);
           
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
          
    
    
})
module.exports=comment
