const request = require('supertest');
const app = require('../server');
const BikeType = require('../module/biketype.model');
const authController = require('../controller/auth.controller');

// Mock the BikeType model
jest.mock('../module/biketype.model');

// Mock the protect middleware
jest.mock('../controller/auth.controller', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: 'mockUserId' }; // Mock authenticated user
    next();
  }),
}));

describe('BikeType API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user/biketype', () => {
    it('should create a new bike type with valid data', async () => {
      BikeType.find.mockResolvedValue([]); // No existing bike type
      BikeType.create.mockResolvedValue({
        _id: 'mockBikeTypeId',
        Biketype: 'Mountain Bike',
      });

      const res = await request(app)
        .post('/user/biketype')
        .send({ bikeType: 'Mountain Bike' });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('Biketype', 'Mountain Bike');
      expect(BikeType.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if bikeType is missing', async () => {
      const res = await request(app)
        .post('/user/biketype')
        .send({});

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Bike Type');
    });

    it('should return 403 if bike type already exists', async () => {
      BikeType.find.mockResolvedValue([{}]); // Simulate existing bike type

      const res = await request(app)
        .post('/user/biketype')
        .send({ bikeType: 'Mountain Bike' });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toContain('Already bike type is exist');
    });

    it('should return 401 if not authenticated', async () => {
      authController.protect.mockImplementationOnce((req, res, next) => {
        next({ statusCode: 401, message: 'you are not log in' });
      });

      const res = await request(app)
        .post('/user/biketype')
        .send({ bikeType: 'Mountain Bike' });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toContain('you are not log in');
    });
  });

  describe('GET /user/biketype', () => {
    it('should return all bike types', async () => {
      BikeType.find.mockResolvedValue([
        { _id: 'id1', Biketype: 'Mountain Bike' },
        { _id: 'id2', Biketype: 'Road Bike' },
      ]);

      const res = await request(app).get('/user/biketype');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveLength(2);
    });

    it('should return 200 with no data if no bike types found', async () => {
      BikeType.find.mockResolvedValue([]);

      const res = await request(app).get('/user/biketype');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'No data found');
      expect(res.body.data).toBeUndefined();
    });

    it('should return 401 if not authenticated', async () => {
      authController.protect.mockImplementationOnce((req, res, next) => {
        next({ statusCode: 401, message: 'you are not log in' });
      });

      const res = await request(app).get('/user/biketype');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toContain('you are not log in');
    });
  });
});