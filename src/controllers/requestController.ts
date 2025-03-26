import { Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import { RequestSchema } from "../model/request";
import { patientSchema } from "../model/patient";
import { AmbulanceTripSchema } from "../model/ambulanceTrip"
import { paymentSchema } from "../model/payment";
import { getdetailsfromtoken } from "../common/tokenvalidator";

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
        country_code:patientData.country_code,
        phone_number: patientData.phone_number,
        email: patientData.email,
      },
      patientSchema
    );

    // Set the patient_id in ambulanceRequestData
    ambulanceRequestData.patient_id = newPatient.patient_id;
    console.log("63",ambulanceRequestData.patient_id )

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

    console.log("53",newAmbulanceRequest )


    // Set the request_id in ambulanceTripData
    ambulanceTripData.request_id = newAmbulanceRequest.id;

    console.log("59",ambulanceTripData )

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
