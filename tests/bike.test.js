const request = require('supertest');
const app = require('../server');
const Bike = require('../module/bike.model');
const BikeType = require('../module/biketype.model');
const authController = require('../controller/auth.controller');
const Like = require('../module/like.model');
const Dislike = require('../module/dislike.model');
const Comment = require('../module/comment.model');

// Mock the models
jest.mock('../module/bike.model');
jest.mock('../module/biketype.model');
jest.mock('../module/like.model');
jest.mock('../module/dislike.model');
jest.mock('../module/comment.model');

// Mock the protect middleware
jest.mock('../controller/auth.controller', () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: 'mockUserId' }; // Mock authenticated user
    next();
  }),
}));

describe('Bike API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user/bike', () => {
    it('should create a new bike with valid data', async () => {
      BikeType.findById.mockResolvedValue({ _id: 'mockBikeTypeId' });
      Bike.findOne.mockResolvedValue(null);
      Bike.create.mockResolvedValue({
        _id: 'newBikeId',
        name: 'Test Bike',
        bikeTypeId: 'mockBikeTypeId',
        price: 100,
      });

      const res = await request(app)
        .post('/user/bike')
        .send({
          name: 'Test Bike',
          bikeTypeId: 'mockBikeTypeId',
          price: 100,
        });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('name', 'Test Bike');
      expect(Bike.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/user/bike')
        .send({
          bikeTypeId: 'mockBikeTypeId',
          price: 100,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Name');
    });

    it('should return 400 if bikeTypeId is missing', async () => {
      const res = await request(app)
        .post('/user/bike')
        .send({
          name: 'Test Bike',
          price: 100,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('BikeType');
    });

    it('should return 400 if price is missing', async () => {
      const res = await request(app)
        .post('/user/bike')
        .send({
          name: 'Test Bike',
          bikeTypeId: 'mockBikeTypeId',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Price');
    });

    it('should return 401 if bike type does not exist', async () => {
      BikeType.findById.mockResolvedValue(null);

      const res = await request(app)
        .post('/user/bike')
        .send({
          name: 'Test Bike',
          bikeTypeId: 'nonExistentBikeTypeId',
          price: 100,
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toContain('This product type does not exists');
    });

    it('should return 403 if bike with name already exists', async () => {
      BikeType.findById.mockResolvedValue({ _id: 'mockBikeTypeId' });
      Bike.findOne.mockResolvedValue({}); // Simulate existing bike

      const res = await request(app)
        .post('/user/bike')
        .send({
          name: 'Existing Bike',
          bikeTypeId: 'mockBikeTypeId',
          price: 100,
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toContain('Already bike is exist');
    });
  });

  describe('GET /user/bike', () => {
    it('should return all bikes', async () => {
      const mockBikes = [
        { _id: 'bike1', name: 'Bike 1' },
        { _id: 'bike2', name: 'Bike 2' },
      ];
      Bike.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBikes),
      });

      const res = await request(app).get('/user/bike');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveLength(2);
    });

    it('should return 200 with no data if no bikes found', async () => {
      Bike.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const res = await request(app).get('/user/bike');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'No data found');
    });
  });

  describe('DELETE /user/bike/:id', () => {
    it('should delete a bike by ID', async () => {
      Bike.findById.mockResolvedValue({});
      Like.deleteMany.mockResolvedValue({});
      Dislike.deleteMany.mockResolvedValue({});
      Comment.deleteMany.mockResolvedValue({});
      Bike.findByIdAndRemove.mockResolvedValue({});

      const res = await request(app).delete('/user/bike/mockBikeId');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(Bike.findByIdAndRemove).toHaveBeenCalledWith('mockBikeId');
    });

    it('should return 404 if bike not found', async () => {
      Bike.findById.mockResolvedValue(null);

      const res = await request(app).delete('/user/bike/nonExistentId');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('Bike is not a found');
    });

    it('should return 404 if ID is missing', async () => {
      const res = await request(app).delete('/user/bike/');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('can\'t find this page'); // This is from global error handler for unmatched routes
    });
  });

  describe('PUT /user/bike/:id', () => {
    it('should update a bike by ID', async () => {
      Bike.findOneAndUpdate.mockResolvedValue({
        _id: 'mockBikeId',
        name: 'Updated Bike',
        price: 150,
      });

      const res = await request(app)
        .put('/user/bike/mockBikeId')
        .send({
          name: 'Updated Bike',
          price: 150,
        });

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('name', 'Updated Bike');
    });

    it('should return 404 if bike not found for update', async () => {
      Bike.findOneAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put('/user/bike/nonExistentId')
        .send({
          name: 'Updated Bike',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('Bike is not a found');
    });

    it('should return 400 if ID is missing', async () => {
      const res = await request(app).put('/user/bike/').send({
        name: 'Updated Bike',
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('can\'t find this page');
    });
  });

  describe('GET /user/bike/:biketype', () => {
    it('should return bikes by type', async () => {
      BikeType.find.mockResolvedValue([{ _id: 'typeId', Biketype: 'Mountain' }]);
      Bike.find.mockResolvedValue([
        { _id: 'bike1', name: 'Mountain Bike 1' },
      ]);

      const res = await request(app).get('/user/bike/Mountain');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveLength(1);
    });

    it('should return 404 if bike type not available', async () => {
      BikeType.find.mockResolvedValue(null);

      const res = await request(app).get('/user/bike/NonExistentType');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('biketype is not available');
    });

    it('should return 404 if no bikes found for the type', async () => {
      BikeType.find.mockResolvedValue([{ _id: 'typeId', Biketype: 'Mountain' }]);
      Bike.find.mockResolvedValue([]);

      const res = await request(app).get('/user/bike/Mountain');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('bike not available by this type');
    });
  });

  describe('GET /user/bike/recent', () => {
    it('should return recently registered bikes', async () => {
      const mockPaginateResult = {
        docs: [{ _id: 'recentBike1' }, { _id: 'recentBike2' }],
        totalDocs: 2,
        prevPage: null,
        nextPage: null,
      };
      Bike.paginate.mockResolvedValue(mockPaginateResult);

      const res = await request(app).get('/user/bike/recent');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('bike');
      expect(res.body.bike.docs).toHaveLength(2);
    });
  });

  describe('GET /user/bike/paginated', () => {
    it('should return paginated bikes', async () => {
      const mockBikes = [
        { _id: 'bike1' },
        { _id: 'bike2' },
        { _id: 'bike3' },
      ];
      Bike.find.mockResolvedValue(mockBikes);
      Bike.count.mockResolvedValue(mockBikes.length);
      Bike.aggregate.mockResolvedValue(mockBikes.slice(0, 2)); // Simulate pagination

      const res = await request(app).get('/user/bike/paginated?page=1&limit=2');

      expect(authController.protect).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('temp');
      expect(res.body.temp).toHaveLength(2);
      expect(res.body).toHaveProperty('total', 3);
    });
  });
});