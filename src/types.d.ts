import { Request } from 'express';

declare module 'express' {
  interface Request {
    userDetails?: {
      id: string;
      email: string;
      role: string;
    };
  }
}
