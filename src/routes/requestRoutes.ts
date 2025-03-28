import express from 'express';
import { createRequest,pendingrequests } from '../controllers/requestController';
import { validateToken } from '../common/tokenvalidator';


const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/createRequest', asyncHandler(validateToken), asyncHandler(createRequest));
router.get('/pendingrequests',asyncHandler(validateToken),  asyncHandler(pendingrequests));




export default router;