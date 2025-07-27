const asyncHandler = require("express-async-handler");
const Bike = require('../module/bike.model');
const Comments = require('../module/comment.model');
const AppError=require('./../arrorhandler/Apperror');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments on bikes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - user_id
 *         - Bike_id
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the comment
 *         user_id:
 *           type: string
 *           description: The ID of the user who made the comment
 *         Bike_id:
 *           type: string
 *           description: The ID of the bike the comment is on
 *         comment:
 *           type: string
 *           description: The comment text
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the comment was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109ce"
 *         user_id: "60d0fe4f5311236168a109cd"
 *         Bike_id: "60d0fe4f5311236168a109cc"
 *         comment: "This is a great bike!"
 *         createdAt: "2023-01-01T12:00:00Z"
 *         updatedAt: "2023-01-01T12:00:00Z"
 */

const comment=asyncHandler(async(req,res,next) => {
            const id = req.params.id;
            const {comment}=req.body
            if(!comment||typeof(comment)==='number'){
              return next(new AppError("please add a comment", 404));
            }
            const bike = await Bike.findById(id);
            if (!bike) {
              return next(new AppError("bike does not exists", 404));
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
