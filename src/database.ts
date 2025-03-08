// src/database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});


const connectToDb = async () => {
    try {
      const client = await pool.connect();
      console.log('Connected to PostgreSQL!');
      client.release(); // Release the client back to the pool
    } catch (err:any) {
      console.error('Error connecting to the database', err.stack);
    }
  };


  export { pool, connectToDb };
