export interface Request{
    id? : number;
    hospitalId: number;
    patientId: number;
    pickupDetails: number;
    dropDetails: number;
    paymentId: number;
    status: number;
}

export const RequestSchema = {
    hospitalId: {type: 'number', required: true},
    patientId: {type: 'number', required: true},
    pickupDetails: {type: 'number', required: true},
    dropDetails: {type: 'number', required: true},
    paymentId: {type: 'number', required: true},
    status: {type: 'number', required: true}
}