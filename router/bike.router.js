const express = require('express');
const { protect } = require('./../controller/auth.controller');
const { createBike, gatAllBike, deletebike, updatebike, getbikebytype, 
    recentbike, getAllBikeWithPagination } = require('../controller/bike.controller')
const { like, dislike, MostLiked } = require('./../controller/likedislike.controller')
const comment = require('./../controller/comment.controller');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Bikes
 *   description: Bike management and operations
 */

/**
 * @swagger
 * /user/bike:
 *   post:
 *     summary: Create a new bike
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bike'
 *     responses:
 *       201:
 *         description: Bike created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all bikes
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of bikes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bike'
 *       401:
 *         description: Unauthorized
 */
router.route('/').post(createBike).get(gatAllBike);

/**
 * @swagger
 * /user/bike/paginated:
 *   get:
 *     summary: Get all bikes with pagination
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of bikes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 totalBikes:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bike'
 *       401:
 *         description: Unauthorized
 */
router.route("/paginated").get(getAllBikeWithPagination);

/**
 * @swagger
 * /user/bike/recent:
 *   get:
 *     summary: Get recently registered bikes
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recently registered bikes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bike'
 *       401:
 *         description: Unauthorized
 */
router.route('/recent').get(recentbike);

/**
 * @swagger
 * /user/bike/most-liked:
 *   get:
 *     summary: Get most liked bikes
 *     tags: [Likes and Dislikes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of most liked bikes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bike'
 *       401:
 *         description: Unauthorized
 */
router.route("/most-liked").get(MostLiked);

/**
 * @swagger
 * /user/bike/{id}/like:
 *   post:
 *     summary: Like a bike
 *     tags: [Likes and Dislikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bike ID
 *     responses:
 *       200:
 *         description: Bike liked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike not found
 */
router.route('/:id/like').post(like);

/**
 * @swagger
 * /user/bike/{id}/dislike:
 *   post:
 *     summary: Dislike a bike
 *     tags: [Likes and Dislikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bike ID
 *     responses:
 *       200:
 *         description: Bike disliked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike not found
 */
router.route("/:id/dislike").post(dislike);

/**
 * @swagger
 * /user/bike/{id}/comment:
 *   post:
 *     summary: Add a comment to a bike
 *     tags: ['Comments']
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bike ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The comment text
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike not found
 */
router.route("/:id/comment").post(comment);

/**
 * @swagger
 * /user/bike/{id}:
 *   put:
 *     summary: Update a bike by ID
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bike ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bike'
 *     responses:
 *       200:
 *         description: Bike updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike not found
 *   delete:
 *     summary: Delete a bike by ID
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The bike ID
 *     responses:
 *       204:
 *         description: Bike deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike not found
 */
router.route('/:id').put(updatebike).delete(deletebike);

/**
 * @swagger
 * /user/bike/{biketype}:
 *   get:
 *     summary: Get bikes by bike type
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: biketype
 *         required: true
 *         schema:
 *           type: string
 *         description: The bike type
 *     responses:
 *       200:
 *         description: A list of bikes of the specified type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bike'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bike type not found
 */
router.route('/:biketype').get(getbikebytype);


module.exports = router;