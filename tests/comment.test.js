const request = require('supertest');
const app = require('../server');
const Bike = require('../module/bike.model');
const Comments = require('../module/comment.model');
const authController = require('../controller/auth.controller');

// Mock the models
jest.mock('../module/bike.model');
jest.mock('../module/comment.model');

// Mock the protect middleware
jest.mock('../controller/auth.controller', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { id: 'mockUserId' }; // Mock authenticated user
    next();
  }),
}));

describe('Comment API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user/bike/:id/comment', () => {
    it('should add a comment to a bike successfully', async () => {
      Bike.findById.mockResolvedValue({ _id: 'mockBikeId' });
      Comments.create.mockResolvedValue({});

      const res = await request(app)
        .post('/user/bike/mockBikeId/comment')
        .send({ comment: 'This is a test comment.' });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('msg', 'Comment Added Successfully');
      expect(Comments.create).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if comment text is missing', async () => {
      const res = await request(app)
        .post('/user/bike/mockBikeId/comment')
        .send({});

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('please add a comment');
    });

    it('should return 404 if comment is a number', async () => {
      const res = await request(app)
        .post('/user/bike/mockBikeId/comment')
        .send({ comment: 123 });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('please add a comment');
    });

    it('should return 404 if bike does not exist', async () => {
      Bike.findById.mockResolvedValue(null);

      const res = await request(app)
        .post('/user/bike/nonExistentBikeId/comment')
        .send({ comment: 'This is a test comment.' });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('bike does not exists');
    });

    it('should return 401 if not authenticated', async () => {
      authController.protect.mockImplementationOnce((req, res, next) => {
        next({ statusCode: 401, message: 'you are not log in' });
      });

      const res = await request(app)
        .post('/user/bike/mockBikeId/comment')
        .send({ comment: 'This is a test comment.' });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toContain('you are not log in');
    });
  });
});