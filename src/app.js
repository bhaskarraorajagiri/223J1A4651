import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import urlRoutes from './routes/url.routes.js';
import { logger } from './middlewares/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(logger); 

// Routes
app.use('/', urlRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB();
});
