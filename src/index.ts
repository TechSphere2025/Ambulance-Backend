import express, { Request, Response } from 'express';
import { Client } from 'pg';

// Create a new Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());


// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});