import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS role (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) UNIQUE NOT NULL,
       status SMALLINT NOT NULL
     );
    `);

    await pool.query(`
   CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    countrycode VARCHAR(10) NOT NULL,
    mobileno VARCHAR(20) NOT NULL,
    hospitalid INT  NULL ,  
    status SMALLINT NOT NULL
);



    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
      user_id INT NOT NULL,
      role_id INT NOT NULL,
      PRIMARY KEY (user_id, role_id)  -- Ensures uniqueness of user-role pairs
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
          countrycode VARCHAR(100)  NOT NULL,
          mobileno VARCHAR(100) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,     
          status INTEGER NOT NULL
        );
      `);

    // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS address (
    //     id SERIAL PRIMARY KEY,
    //     hospitalId INTEGER NOT NULL,
    //     addressLine1 VARCHAR(100) NOT NULL,
    //     addressLine2 VARCHAR(100) NOT NULL,
    //     landmark VARCHAR(100) NOT NULL,
    //     city VARCHAR(100) NOT NULL,
    //     state VARCHAR(100) NOT NULL,
    //     lat INTEGER NOT NULL,
    //     long INTEGER NOT NULL,
    //     status INTEGER NOT NULL
    //   );
    // `);

    // await pool.query(`
    //     CREATE TABLE IF NOT EXISTS patients(
    //      id SERIAL PRIMARY KEY,
    //      firstName VARCHAR(100) NOT NULL,
    //      lastName VARCHAR(100) NOT NULL,
    //      mobileNo INTEGER NOT NULL,
    //      countryCode INTEGER NOT NULL,
    //      dob INTEGER NOT NULL,
    //      status INTEGER NOT NULL
    //     );
    //   `);

    // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS payment(
    //    id SERIAL PRIMARY KEY,
    //    currencyType VARCHAR(100) NOT NULL,
    //    amount INTEGER NOT NULL,
    //    discount INTEGER NOT NULL,
    //    totalAmount INTEGER NOT NULL,
    //    status INTEGER NOT NULL
    //   );
    // `);
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
