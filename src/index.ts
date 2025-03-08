import express, { Request, Response } from 'express';
import { connectToDb, pool } from './database'; // Import connection and pool


const port = process.env.PORT || 3000;

// Create a new Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());


// Start the Express server
app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    await connectToDb(); // Test PostgreSQL connection when the server starts
  });