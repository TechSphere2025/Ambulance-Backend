import express from 'express';
import { createHospital,createHospitalUser,hospitalusers,hospitals } from '../controllers/hospitalController';
import { validateToken } from '../common/tokenvalidator';


const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/create', asyncHandler(validateToken) ,asyncHandler(createHospital));

router.post('/createUser', asyncHandler(validateToken) ,asyncHandler(createHospitalUser));

router.get('/hospitals', asyncHandler(validateToken) ,asyncHandler(hospitals));



router.get('/hospitalusers', asyncHandler(validateToken) ,asyncHandler(hospitalusers));

export default router;