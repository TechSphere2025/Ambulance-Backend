export interface User {
    id: number;
    name: string;
    email: string;
  }


  export const userSchema = {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true },
  };