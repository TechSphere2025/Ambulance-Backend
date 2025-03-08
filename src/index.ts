import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes';
import pool from './database';


dotenv.config();



const app = express();

app.use(express.json());
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3000;

DbConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function DbConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

