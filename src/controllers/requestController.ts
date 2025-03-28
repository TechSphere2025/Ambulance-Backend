import { Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { RequestSchema } from "../model/request";
import { patientSchema } from "../model/patient";
import { AmbulanceTripSchema } from "../model/ambulanceTrip"
import { paymentSchema } from "../model/payment";
import { getdetailsfromtoken } from "../common/tokenvalidator";
import pool from "../database";

export const createRequest = async (req: Request, res: Response) => {
  try {
    // Destructure the payload from the request body
    const {
      patientData,
      ambulanceRequestData,
      ambulanceTripData,
      paymentData,
    } = req.body;

    // Insert patient data into the patients table
    const newPatient: any = await baseRepository.insert(
      'patients',
      {
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        date_of_birth: patientData.date_of_birth,
        gender: patientData.gender,
        country_code: patientData.country_code,
        phone_number: patientData.phone_number,
        email: patientData.email,
      },
      patientSchema
    );

    // Set the patient_id in ambulanceRequestData
    ambulanceRequestData.patient_id = newPatient.patient_id;
    console.log("63", ambulanceRequestData.patient_id)

    const token = req.headers['token'];

    let details = await getdetailsfromtoken(token)

    // Insert ambulance request data into the ambulance_requests table
    const newAmbulanceRequest: any = await baseRepository.insert(
      'ambulance_requests',
      {
        patient_id: ambulanceRequestData.patient_id,
        hospital_id: details.hospitalid,  // Now includes hospital_id
        request_status: ambulanceRequestData.request_status,
      },
      RequestSchema
    );

    console.log("53", newAmbulanceRequest)


    // Set the request_id in ambulanceTripData
    ambulanceTripData.request_id = newAmbulanceRequest.id;

    console.log("59", ambulanceTripData)

    // Insert ambulance trip data into the ambulance_trips table
    const newAmbulanceTrip: any = await baseRepository.insert(
      'ambulance_trips',
      {
        request_id: ambulanceTripData.request_id,
        pickup_address_line1: ambulanceTripData.pickup_address_line1,
        pickup_address_line2: ambulanceTripData.pickup_address_line2,
        pickup_city: ambulanceTripData.pickup_city,
        pickup_state: ambulanceTripData.pickup_state,
        pickup_latitude: ambulanceTripData.pickup_latitude,
        pickup_longitude: ambulanceTripData.pickup_longitude,
        drop_address_line1: ambulanceTripData.drop_address_line1,
        drop_address_line2: ambulanceTripData.drop_address_line2,
        drop_city: ambulanceTripData.drop_city,
        drop_state: ambulanceTripData.drop_state,
        drop_latitude: ambulanceTripData.drop_latitude,
        drop_longitude: ambulanceTripData.drop_longitude,
        pickup_time: ambulanceTripData.pickup_time,
        drop_time: ambulanceTripData.drop_time,
        ambulance_id: ambulanceTripData.ambulance_id,
        driver_id: ambulanceTripData.driver_id,
        status: ambulanceTripData.status
      },
      AmbulanceTripSchema
    );

    // Set the trip_id in paymentData
    paymentData.trip_id = newAmbulanceTrip.trip_id;

    // Insert payment data into the payments table
    const newPayment: any = await baseRepository.insert(
      'payments',
      {
        trip_id: paymentData.trip_id,
        payment_amount: paymentData.payment_amount,
        payment_method: paymentData.payment_method,
        payment_status: paymentData.payment_status,
        payment_date: paymentData.payment_date
      },
      paymentSchema
    );

    // Return success response with created data
    res.status(201).json({
      patient: newPatient,
      ambulanceRequest: newAmbulanceRequest,
      ambulanceTrip: newAmbulanceTrip,
      payment: newPayment,
      message: 'Request created successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const pendingrequests = async (req: Request, res: Response) => {
  try {


    const token = req.headers['token'];

    let details = await getdetailsfromtoken(token)
    const hospital_id = details.hospitalid
    const query = `
    SELECT 
        ar.ID AS ID, 
        ar.hospital_id,
        ar.request_status,
        ar.created_at AS request_created_at,
        ar.updated_at AS request_updated_at,

        -- Patient details
        p.patient_id,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.gender,
        p.phone_number,
        p.email,

        -- Ambulance trip details
        at.trip_id,
        at.pickup_address_line1,
        at.pickup_address_line2,
        at.pickup_city,
        at.pickup_state,
        at.pickup_latitude,
        at.pickup_longitude,
        at.drop_address_line1,
        at.drop_address_line2,
        at.drop_city,
        at.drop_state,
        at.drop_latitude,
        at.drop_longitude,
        at.pickup_time,
        at.drop_time,
        at.ambulance_id,
        at.driver_id,
        at.status AS trip_status,
        at.created_at AS trip_created_at,
        at.updated_at AS trip_updated_at,

        -- Payment details
        pm.payment_id,
        pm.payment_amount,
        pm.payment_method,
        pm.payment_status,
        pm.payment_date

    FROM 
        ambulance_requests ar
    LEFT JOIN 
        patients p ON ar.patient_id = p.patient_id
    LEFT JOIN 
        ambulance_trips at ON ar.ID = at.request_id
    LEFT JOIN 
        payments pm ON at.trip_id = pm.trip_id
    WHERE 
        ar.hospital_id = $1
        AND (at.ambulance_id IS NULL AND at.driver_id IS NULL); -- Filter for NULL values
`;

    const result = await pool.query(query, [hospital_id]);



    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No requests found for this hospital ID" });
    }

    // Structure the response properly
    const requests = result.rows.map((row) => ({
      request_id: row.request_id,
      hospital_id: row.hospital_id,
      request_status: row.request_status,
      request_created_at: row.request_created_at,
      request_updated_at: row.request_updated_at,

      patient: {
        patient_id: row.patient_id,
        first_name: row.first_name,
        last_name: row.last_name,
        date_of_birth: row.date_of_birth,
        gender: row.gender,
        phone_number: row.phone_number,
        email: row.email,
        address: row.address,
      },

      ambulance_trip: {
        trip_id: row.trip_id,
        pickup_address_line1: row.pickup_address_line1,
        pickup_address_line2: row.pickup_address_line2,
        pickup_city: row.pickup_city,
        pickup_state: row.pickup_state,
        pickup_latitude: row.pickup_latitude,
        pickup_longitude: row.pickup_longitude,
        drop_address_line1: row.drop_address_line1,
        drop_address_line2: row.drop_address_line2,
        drop_city: row.drop_city,
        drop_state: row.drop_state,
        drop_latitude: row.drop_latitude,
        drop_longitude: row.drop_longitude,
        pickup_time: row.pickup_time,
        drop_time: row.drop_time,
        ambulance_id: row.ambulance_id,
        driver_id: row.driver_id,
        trip_status: row.trip_status,
        trip_created_at: row.trip_created_at,
        trip_updated_at: row.trip_updated_at
      },

      payment: {
        payment_id: row.payment_id,
        payment_amount: row.payment_amount,
        payment_method: row.payment_method,
        payment_status: row.payment_status,
        payment_date: row.payment_date
      }
    }));

    res.status(200).json({ requests });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 

export const assignAmbulanceanddriver = async (req: Request, res: Response) => {
  try {
    const { trip_id, ambulance_id, driver_id } = req.body;

    if (!trip_id || !ambulance_id || !driver_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the trip exists
    const existingTrip:any = await baseRepository.findOne("ambulance_trips", "trip_id = $1", [trip_id]);

    if (!existingTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (!existingTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Start transaction
    // await baseRepository.startTransaction();

    // Update ambulance trip
    await baseRepository.update(
      "ambulance_trips",  // Table
      "trip_id = $1",     // Condition
      [trip_id],          // Condition value(s)
      {
        ambulance_id,
        driver_id,
        status: "Assigned Ambulance",
        updated_at: new Date()
      }  // Data to update
    );
    

    // Update the corresponding request status

    const request = await baseRepository.findOne("ambulance_requests", { id: existingTrip.request_id });

    if (request) {
      await baseRepository.update(
        "ambulance_requests",  // Table name
        "id = $1",     // Condition (assuming `request_id` is unique)
        [existingTrip.request_id],  // Condition value (parameterized for SQL injection safety)
        {
          request_status: "Ambulance Assigned",  // Updated field
          updated_at: new Date()        // Updated timestamp
        }  // Data to update
      );
      
    }

    // Commit transaction
    // await baseRepository.commitTransaction();

    res.status(200).json({
      message: "Ambulance and driver assigned successfully",
      trip: { ...existingTrip, ambulance_id, driver_id, trip_status: "Assigned Ambulance" },
      request: request ? { ...request, request_status: "Ambulance Assigned" } : null
    });

  } catch (error) {
    // await baseRepository.rollbackTransaction();
    console.error("Error assigning ambulance and driver:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
