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
        url: "https://foodapp-backend-a3ew.onrender.com", // ✅ Change this
        description: "Production server (Render)",
      },
    ],
  },
  apis: ["./routes/UserRoutes.js", "./routes/ResturantRoutes.js", "./routes/NotificationRoutes.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
