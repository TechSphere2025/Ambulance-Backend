// 🚑 Ambulance Interface
export interface Ambulance {
    id: number;
    vehicle_no: string;
    type: string;
    vehicle_type: string;
    hospital_id: number;     // Foreign key reference to hospital
    status: number;          // Status as integer
}

// 🚑 Ambulance Schema Definition
export const ambulanceSchema = {
    vehicle_no: { type: 'string', required: true, unique: true, max: 50 },
    type: { type: 'string', required: true, enum: ['ALS', 'BLS', 'PTS'] },
    vehicle_type: { type: 'string', required: true, enum: ['Van', 'Truck', 'SUV', 'Motorcycle'] },
    hospital_id: { type: 'number', required: true },   // Foreign key reference to hospital
    status: { type: 'number', required: true }         // Status as integer
};
