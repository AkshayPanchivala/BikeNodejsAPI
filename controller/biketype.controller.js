const asyncHandler = require("express-async-handler");
const AppError = require('../arrorhandler/Apperror');
const BikeType=require('./../module/biketype.model');

/**
 * @swagger
 * tags:
 *   name: Bike Types
 *   description: Bike type management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BikeType:
 *       type: object
 *       required:
 *         - Biketype
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the bike type
 *         Biketype:
 *           type: string
 *           description: The name of the bike type
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the bike type was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the bike type was last updated
 *       example:
 *         _id: "60d0fe4f5311236168a109cc"
 *         Biketype: "Mountain Bike"
 *         createdAt: "2023-01-01T12:00:00Z"
 *         updatedAt: "2023-01-01T12:00:00Z"
 */

/**
 * @swagger
 * /user/biketype:
 *   post:
 *     summary: Create a new bike type
 *     tags: [Bike Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bikeType
 *             properties:
 *               bikeType:
 *                 type: string
 *                 description: The name of the bike type to create
 *     responses:
 *       201:
 *         description: Bike type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/BikeType'
 *       400:
 *         description: Bad request, missing required fields
 *       403:
 *         description: Bike type already exists
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
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




/**
 * @swagger
 * /user/biketype:
 *   get:
 *     summary: Get all bike types
 *     tags: [Bike Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of bike types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: No data found
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BikeType'
 *       401:
 *         description: Unauthorized, token missing or invalid
 */
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