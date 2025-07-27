const request = require('supertest');
const app = require('../server');
const User = require('../module/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the User model
jest.mock('../module/user.model');

// Mock bcrypt.compare
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Mock jwt.sign
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('User API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /user/register', () => {
    it('should register a new user with valid data', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        save: jest.fn(),
      });
      bcrypt.hash.mockResolvedValue('hashedpassword');

      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'StrongPassword123',
          confirmPassword: 'StrongPassword123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
      expect(User.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'StrongPassword123',
          confirmPassword: 'StrongPassword123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Name');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          password: 'StrongPassword123',
          confirmPassword: 'StrongPassword123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Email');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          confirmPassword: 'StrongPassword123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Password');
    });

    it('should return 400 if confirmPassword is missing', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'StrongPassword123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('ConfirmPassword');
    });

    it('should return 403 if password and confirmPassword do not match', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'StrongPassword123',
          confirmPassword: 'MismatchPassword',
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toContain('Password and confirmpassword are not matching');
    });

    it('should return 409 if user with email already exists', async () => {
      User.findOne.mockResolvedValue([{}]); // Simulate existing user

      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'StrongPassword123',
          confirmPassword: 'StrongPassword123',
        });
      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toContain('Already user is exist');
    });

    it('should return 400 if email format is invalid', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockImplementation(() => {
        throw new Error('ValidationError: User validation failed: email: Please provide Email');
      });

      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'StrongPassword123',
          confirmPassword: 'StrongPassword123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Invalid input data');
    });

    it('should return 400 if password is not strong enough', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockImplementation(() => {
        throw new Error('ValidationError: User validation failed: password: Please provide strong password');
      });

      const res = await request(app)
        .post('/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak',
          confirmPassword: 'weak',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Invalid input data');
    });
  });

  describe('POST /user/login', () => {
    it('should log in a user with valid credentials', async () => {
      const mockUser = {
        _id: 'someid',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocktoken');

      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'StrongPassword123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('token', 'mocktoken');
      expect(bcrypt.compare).toHaveBeenCalledWith('StrongPassword123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({
          password: 'StrongPassword123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Email');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Password');
    });

    it('should return 404 if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain("can't find user");
    });

    it('should return 403 if password is incorrect', async () => {
      const mockUser = {
        _id: 'someid',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toContain('username or password is incorrect');
    });
  });
});