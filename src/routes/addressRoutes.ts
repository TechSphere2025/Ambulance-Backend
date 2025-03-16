import express from 'express';
import { getAddresses } from '../controllers/addressController';

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post('/getAddress', asyncHandler(getAddresses));

export default router;