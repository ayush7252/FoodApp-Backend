const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Food App Backend API",
      version: "1.0.0",
      description: "API for managing users in the Food App Backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
      {
        url: "https://foodapp-backend-a3ew.onrender.com",
        description: "Production server (Render)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    "./Routes/UserRoutes.js", 
    "./Routes/ResturantRoutes.js", 
    "./Routes/NotificationRoutes.js",
    "./Routes/EmailRoutes.js"
  ],
  // Enable this for production to fix path issues
  explorer: true
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
