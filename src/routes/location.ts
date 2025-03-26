import express from 'express';
import { searchAddress } from '../controllers/locationController';

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/searchAddress',  asyncHandler(searchAddress));

export default router;
