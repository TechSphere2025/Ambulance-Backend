import express from 'express';
import {  createAmbulance,getambulances } from '../controllers/ambulanceController';
import { validateToken } from '../common/tokenvalidator';

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/createAmbulance',asyncHandler(validateToken) , asyncHandler(createAmbulance));
router.get('/getambulances', asyncHandler(validateToken), asyncHandler(getambulances));


export default router;
