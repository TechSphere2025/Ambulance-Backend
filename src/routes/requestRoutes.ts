import express from 'express';
import { createRequest } from '../controllers/requestController';

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/createRequest', asyncHandler(createRequest));

export default router;