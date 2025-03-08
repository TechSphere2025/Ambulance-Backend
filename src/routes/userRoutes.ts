// src/routes/userRoutes.ts
import express, { Request, Response } from 'express';
// import pool from '../database';

const router = express.Router();

// Example route to get all users
// router.get('/', async (req: Request, res: Response) => {
//   try {
//    // const result = await pool.query('SELECT * FROM users');
//     res.status(200).json(result.rows); // Return users as JSON
//   } catch (error) {
//     console.error('Error fetching users', error);
//     res.status(500).json({ message: 'Error fetching users' });
//   }
// });

// Example route to test PostgreSQL connection
// router.get('/test-db', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.status(200).json({
//       message: 'Connected to PostgreSQL',
//       time: result.rows[0].now,
//     });
//   } catch (error) {
//     console.error('Error connecting to the database', error);
//     res.status(500).json({ message: 'Database connection error' });
//   }
// });

export default router;
