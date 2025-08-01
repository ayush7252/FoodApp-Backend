const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const { errorHandler } = require('./Middleware/ErrorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Swagger');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS setup
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // True in production (HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Static file serving for uploads
app.use('/Uploads', express.static(path.join(__dirname, 'Middleware/Uploads'), {
  setHeaders: (res, path) => {
    console.log(`Serving static file: ${path}`);
  }
}));

// Routes
app.use('/api/users', require('./Routes/UserRoutes'));
app.use('/api/restaurants', require('./Routes/ResturantRoutes'));
app.use('/api', require('./Routes/NotificationRoutes'));
app.use('/api/email', require('./Routes/EmailRoutes'));

// Swagger UI configuration
const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'Food App API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
  }
};

// Serve Swagger docs
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

// Redirect root to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));