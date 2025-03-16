import express from 'express';
import { createHospital } from '../controllers/hospitalController';

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/create', asyncHandler(createHospital));

export default router;