import express from 'express';
import cors from "cors";

import dotenv from 'dotenv';
import userRouter from './routes/userRoutes';
import hospitalRouter from './routes/hospitalRoutes';
import addressRoutes from './routes/addressRoutes';
import locationRouter from './routes/location';
import roleRouter from './routes/roleRoutes';

import requestRouter from './routes/requestRoutes';

import pool from './database';
import { errorHandlingMiddleware } from './common/joiValidations/errorhandler'; 
import { ErrorRequestHandler } from 'express';

dotenv.config();



const app = express();
app.use(cors());


app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/hospital', hospitalRouter);
app.use('/api/address', addressRoutes);
app.use('/api/location', locationRouter);
app.use('/api/requests', requestRouter);

app.use('/api/role', roleRouter);



const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:3000",  // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true  // Allow cookies
}))
// Regular middleware

app.use(errorHandlingMiddleware as ErrorRequestHandler);

// DbConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// async function DbConnection() {
//   try {
//     const client = await pool.connect();
//     console.log('Database connected successfully');
//     client.release();
//   } catch (error) {
//     console.error('Database connection failed:', error);
//   }
// }

