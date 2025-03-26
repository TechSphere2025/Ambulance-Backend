import express from 'express';
import { createRequest } from '../controllers/requestController';
import { validateToken } from '../common/tokenvalidator';


const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/createRequest', asyncHandler(validateToken), asyncHandler(createRequest));

export default router;