export interface AmbulanceRequest {
    patient_id: number;          // The ID of the patient requesting the ambulance.
    request_status: string;      // The status of the request (e.g., "Pending", "Completed").
    created_at?: Date;           // The timestamp when the request was created (default value is `CURRENT_TIMESTAMP`).
    updated_at?: Date;           // The timestamp when the request was last updated (default value is `CURRENT_TIMESTAMP`).
  }
  
export const RequestSchema = {
    patient_id: {type: 'number', required: true},
    request_status: {type: 'string', required: true},
}