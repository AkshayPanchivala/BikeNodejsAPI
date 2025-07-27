const request = require('supertest');
const app = require('../server');
const Bike = require('../module/bike.model');
const Like = require('../module/like.model');
const Dislike = require('../module/dislike.model');
const Comment = require('../module/comment.model');
const authController = require('../controller/auth.controller');

// Mock the models
jest.mock('../module/bike.model');
jest.mock('../module/like.model');
jest.mock('../module/dislike.model');
jest.mock('../module/comment.model');

// Mock the protect middleware
jest.mock('../controller/auth.controller', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { id: 'mockUserId' }; // Mock authenticated user
    next();
  }),
}));

describe('Like/Dislike API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user/bike/:id/like', () => {
    it('should like a bike successfully', async () => {
      Bike.findById.mockResolvedValue({ _id: 'mockBikeId' });
      Like.findOne.mockResolvedValue(null);
      Dislike.findOneAndDelete.mockResolvedValue({});
      Like.create.mockResolvedValue({});

      const res = await request(app).post('/user/bike/mockBikeId/like');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(400); // Controller returns 400 for success
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('msg', 'successfully liked this bike');
      expect(Like.create).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if bike not found', async () => {
      Bike.findById.mockResolvedValue(null);

      const res = await request(app).post('/user/bike/nonExistentId/like');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('Bike is not found');
    });

    it('should return 400 if user already liked the bike', async () => {
      Bike.findById.mockResolvedValue({ _id: 'mockBikeId' });
      Like.findOne.mockResolvedValue({}); // Simulate existing like

      const res = await request(app).post('/user/bike/mockBikeId/like');

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('you are already like this product');
    });
  });

  describe('POST /user/bike/:id/dislike', () => {
    it('should dislike a bike successfully', async () => {
      Bike.findById.mockResolvedValue({ _id: 'mockBikeId' });
      Dislike.findOne.mockResolvedValue(null);
      Like.findOneAndDelete.mockResolvedValue({});
      Dislike.create.mockResolvedValue({});

      const res = await request(app).post('/user/bike/mockBikeId/dislike');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(400); // Controller returns 400 for success
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('msg', 'successfully disliked this bike');
      expect(Dislike.create).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if bike not found', async () => {
      Bike.findById.mockResolvedValue(null);

      const res = await request(app).post('/user/bike/nonExistentId/dislike');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('Bike is not found');
    });

    it('should return 400 if user already disliked the bike', async () => {
      Bike.findById.mockResolvedValue({ _id: 'mockBikeId' });
      Dislike.findOne.mockResolvedValue({}); // Simulate existing dislike

      const res = await request(app).post('/user/bike/mockBikeId/dislike');

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('you Have already dislike this product');
    });
  });

  describe('GET /user/bike/most-liked', () => {
    it('should return the most liked bike', async () => {
      Like.aggregate.mockResolvedValue([
        { _id: 'mockBikeId', count: 5 },
      ]);
      Bike.findById.mockResolvedValue({ _id: 'mockBikeId', name: 'Most Liked Bike' });
      Comment.find.mockResolvedValue([]);

      const res = await request(app).get('/user/bike/most-liked');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('mostlikedbike');
      expect(res.body.mostlikedbike).toHaveProperty('name', 'Most Liked Bike');
      expect(res.body).toHaveProperty('count', 5);
    });

    it('should return 404 if no likes found', async () => {
      Like.aggregate.mockResolvedValue([]);

      const res = await request(app).get('/user/bike/most-liked');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('No Likes Found any Of the Bikes');
    });

    it('should return 404 if most liked bike not found in DB', async () => {
      Like.aggregate.mockResolvedValue([
        { _id: 'nonExistentBikeId', count: 5 },
      ]);
      Bike.findById.mockResolvedValue(null);

      const res = await request(app).get('/user/bike/most-liked');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('Bike is not found');
    });
  });
});