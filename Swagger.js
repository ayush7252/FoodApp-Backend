const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Food App Backend API',
      version: '1.0.0',
      description: 'API for managing users in the Food App Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/UserRoutes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;