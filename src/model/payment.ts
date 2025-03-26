export interface Payment {
    payment_id?: number;            // The payment ID is optional as it's auto-generated (auto-incremented).
    trip_id: number;                // The ID of the related ambulance trip (foreign key referencing `ambulance_trips`).
    payment_amount: number;         // The amount of the payment (decimal with 2 decimal places).
    payment_method?: string;        // The payment method (optional).
    payment_status: string;         // The status of the payment (e.g., "Pending", "Completed", "Failed").
    payment_date?: Date;            // The timestamp of when the payment was made (optional, default value is `CURRENT_TIMESTAMP`).
  }
  
  export const paymentSchema = {
    payment_id: { type: 'number', required: false },
    trip_id: { type: 'number', required: true },
    payment_amount: { type: 'number', required: true },
    payment_method: { type: 'string', required: false },
    payment_status: { type: 'string', required: true },
    payment_date: { type: 'string', required: false },  // Store as a string (ISO 8601 format)
  };
  