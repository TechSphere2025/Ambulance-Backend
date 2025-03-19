export interface patientDetails {
    id: number;
    firstName: string;
    lastName: string;
    mobileNo: number;
    countryCode: number;
    dob: number;
    status : number;
}

export const patientSchema = {
    firstName: {type: 'string', require : true},
    lastName : {type: 'string', require : true},
    mobileNo : {type: 'number', require : true},
    countryCode : {type: 'number', require : true},
    dob : {type: 'number', require : true},
    status : {type: 'number', require : true},
}