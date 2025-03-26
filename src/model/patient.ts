export interface PatientDetails {
    id?: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    phone_number: string;
    email: string;
    address: string;
  }

  export const patientSchema = {
    first_name: { type: 'string', require: true },
    last_name: { type: 'string', require: true },
    date_of_birth: { type: 'string', require: true },  // This could be a string representing the date (ISO format)
    gender: { type: 'string', require: true }, // This would hold values like 'Male', 'Female', or 'Other'
    phone_number: { type: 'string', require: true }, // Use string to hold formatted phone numbers like '123-456-7890'
    email: { type: 'string',  },
  };