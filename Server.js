const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');
const { errorHandler } = require('./Middleware/ErrorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Swagger');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

dotenv.config();          // ✅ Load env first
connectDB();              // ✅ Connect to DB

const app = express();    // ✅ Initialize app before use

// ✅ Apply CORS before anything else
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Session management
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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// ✅ Routes and Swagger
app.use('/api/users', require('./Routes/UserRoutes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Error handler
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
