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

    await pool.query(`
          CREATE TABLE IF NOT EXISTS ambulances (
        id SERIAL PRIMARY KEY,                     
        vehicle_no VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(10) NOT NULL,                
        vehicle_type VARCHAR(15) NOT NULL,        
        hospital_id INT NOT NULL,                  
        status INTEGER NOT NULL NOT NULL
    );
         `);

    await pool.query(`
          CREATE TABLE IF NOT EXISTS patients (
    patient_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
     country_code VARCHAR(15) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
         `);

    await pool.query(`
          CREATE TABLE IF NOT EXISTS ambulance_requests (
    id SERIAL PRIMARY KEY,
    patient_id INT ,
    hospital_id INT NOT NULL,
    request_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
         `);

    await pool.query(`
         CREATE TABLE IF NOT EXISTS ambulance_trips (
    trip_id SERIAL PRIMARY KEY,
    request_id INT ,
    pickup_address_line1 TEXT,
    pickup_address_line2 TEXT,
    pickup_city VARCHAR(100),
    pickup_state VARCHAR(100),
    pickup_latitude DECIMAL(9, 6),  -- Latitude (6 decimal places)
    pickup_longitude DECIMAL(9, 6), -- Longitude (6 decimal places)
    drop_address_line1 TEXT,
    drop_address_line2 TEXT,
    drop_city VARCHAR(100),
    drop_state VARCHAR(100),
    drop_latitude DECIMAL(9, 6),  -- Latitude (6 decimal places)
    drop_longitude DECIMAL(9, 6), -- Longitude (6 decimal places)
    pickup_time TIMESTAMP,
    drop_time TIMESTAMP,
    ambulance_id INT, -- Optionally reference an ambulance or driver
    driver_id INT, -- Optionally reference an ambulance or driver

    status VARCHAR(50) NOT NULL DEFAULT 'In Progress', -- e.g., In Progress, Completed, Cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
         `);

    await pool.query(`

         CREATE TABLE IF NOT EXISTS payments (
          payment_id SERIAL PRIMARY KEY,
          trip_id INT ,
          payment_amount DECIMAL(10, 2) NOT NULL,
          payment_method VARCHAR(50), -- e.g., Credit Card, Cash, Online Transfer
          payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- e.g., Pending, Completed, Failed
          payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
       `);


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
