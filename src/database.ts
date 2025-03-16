import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS login (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(100)  NOT NULL
        );
      `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS hospital (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          mobileNo VARCHAR(100)  NOT NULL,
          secondaryMobileNo VARCHAR(100)  UNIQUE,
          emailid VARCHAR(100) UNIQUE NOT NULL,
          orgName VARCHAR(100),
          orgType VARCHAR(100),
          status INTEGER NOT NULL
        );
      `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS address (
        id SERIAL PRIMARY KEY,
        hospitalId INTEGER NOT NULL,
        addressLine1 VARCHAR(100) NOT NULL,
        addressLine2 VARCHAR(100) NOT NULL,
        landmark VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        lat INTEGER NOT NULL,
        long INTEGER NOT NULL,
        status INTEGER NOT NULL
      );
    `);

    // await pool.query(`
    //     CREATE TABLE IF NOT EXISTS hospital
    //   `);


  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

// Ensure the table is created on startup
createUsersTable();

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Unexpected database error", err);
});

export default pool;
