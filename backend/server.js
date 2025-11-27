import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import thoughtRoutes from './src/routes/thoughtRoutes.js';
import itemRoutes from './src/routes/itemRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connections
connectDB();

// Routes
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('ThoughtOS Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
