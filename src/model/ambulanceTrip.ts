export interface AmbulanceTrip {
    trip_id?: number;               // The trip ID is optional since it will be auto-generated (auto-incremented).
    request_id: number;             // The ID of the related ambulance request (foreign key referencing `ambulance_requests`).
    pickup_address_line1: string;   // Pickup address line 1.
    pickup_address_line2?: string;  // Pickup address line 2 (optional).
    pickup_city: string;            // Pickup city.
    pickup_state: string;           // Pickup state.
    pickup_latitude: number;        // Pickup latitude (decimal with 6 decimal places).
    pickup_longitude: number;       // Pickup longitude (decimal with 6 decimal places).
    drop_address_line1: string;     // Drop address line 1.
    drop_address_line2?: string;    // 
    // 
    // Drop address line 2 (optional).
    drop_city: string;              // Drop city.
    drop_state: string;             // Drop state.
    drop_latitude: number;          // Drop latitude (decimal with 6 decimal places).
    drop_longitude: number;         // Drop longitude (decimal with 6 decimal places).
    pickup_time: Date;              // Pickup timestamp.
    drop_time: Date;                // Drop timestamp.
    ambulance_id?: number;          // Optionally reference an ambulance (foreign key).
    driver_id?: number;             // Optionally reference a driver (foreign key).
    status: string;                 // Status of the trip (e.g., "In Progress", "Completed", "Cancelled").
    created_at?: Date;              // Timestamp when the record was created (default value is `CURRENT_TIMESTAMP`).
    updated_at?: Date;              // Timestamp when the record was last updated (default value is `CURRENT_TIMESTAMP`).
  }


  export const AmbulanceTripSchema = {
    trip_id: { type: 'number', required: false },
    request_id: { type: 'number', required: true },
    pickup_address_line1: { type: 'string', required: true },
    pickup_address_line2: { type: 'string', required: false },
    pickup_city: { type: 'string', required: true },
    pickup_state: { type: 'string', required: true },
    pickup_latitude: { type: 'number', required: true },
    pickup_longitude: { type: 'number', required: true },
    drop_address_line1: { type: 'string', required: true },
    drop_address_line2: { type: 'string', required: false },
    drop_city: { type: 'string', required: true },
    drop_state: { type: 'string', required: true },
    drop_latitude: { type: 'number', required: true },
    drop_longitude: { type: 'number', required: true },
    pickup_time: { type: 'string', required: true },  // Store in ISO 8601 format
    drop_time: { type: 'string', required: true },    // Store in ISO 8601 format
    ambulance_id: { type: 'number', required: false },
    driver_id: { type: 'number', required: false },
    status: { type: 'string', required: true },
    created_at: { type: 'string', required: false }, // Store in ISO 8601 format
    updated_at: { type: 'string', required: false }, // Store in ISO 8601 format
  };
  
  