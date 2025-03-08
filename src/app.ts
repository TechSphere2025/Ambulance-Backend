// src/app.ts
import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';

// Initialize the app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

// Test route to check server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

console.log("dddd")
// pool.connect((err, client, done) => {
//     if (err) {
//       console.error('Error connecting to the database:', err.stack);
//     } else {
//       console.log('Connected to the database');
//     }
//   });
export default app;
