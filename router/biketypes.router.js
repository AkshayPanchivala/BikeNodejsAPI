const express=require('express');

const {createBikeType,getAllBikeType}=require('../controller/biketype.controller');
const { protect }=require('./../controller/auth.controller');

const router=express.Router();

router.use(protect);

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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the bike type
 *     responses:
 *       201:
 *         description: Bike type created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Bike type already exists
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BikeType'
 *       401:
 *         description: Unauthorized
 */
router.route('/').post(createBikeType).get(getAllBikeType);


module.exports=router;
