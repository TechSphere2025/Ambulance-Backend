export interface Hospital{
    id?: number;
    name: string;
    countrycode:string,
    mobileno: string;
    email: string;
    status: number;
   
}

export const hospitalSchema = {
    name : {type: 'string', required: true},
    countrycode: {type: 'string', required: true},
    mobileno: {type: 'string', required: true},
    email: {type: 'string', required: true},
    status: {type: 'number', required: true},
  
}
