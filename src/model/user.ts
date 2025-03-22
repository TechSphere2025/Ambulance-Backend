export interface User {
    id: number;
    name: string;
    email: string;
    countrycode:string;
    mobileno:string;
    status:number;

  }


  export const userSchema = {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true },
    countrycode: { type: 'string', required: true,  },
    mobileno: { type: 'string', required: true, unique: true },
    status: { type: 'number', required: true, unique: true },


  };