import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import shortUrlRoutes from './routes/shortUrl.route.js';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use('/', shortUrlRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
