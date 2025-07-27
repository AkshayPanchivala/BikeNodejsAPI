const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUrl=process.env.SWAGGER_URL || `http://localhost:8000`; // Adjust this to your server URL
const swaggerDescription = process.env.SWAGGER_DESCRIPTION || 'API documentation for the BikeNodejsAPI project';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BikeNodejsAPI',
      version: '1.0.0',
      description: 'API documentation for the BikeNodejsAPI project',
    },
    tags: [
      {
        name: 'Users',
        description: 'API for user-related operations',
      },
       {
        name: 'Bike Types',
        description: 'Bike type management and operations',
      },
      {
        name: 'Bikes',
        description: 'Bike management and operations',
      },
     
      // Add any other tags here in the desired order
    ],
    servers: [
      {
        url: swaggerUrl,
        description: swaggerDescription,
      },
    ],
  },
  apis: ['./router/*.js', './controller/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
