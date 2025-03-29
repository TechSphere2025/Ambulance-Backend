import express from 'express';
import { createRequest,pendingrequests,assignAmbulanceanddriver,updatetrip,completedtrips,mytrips  } from '../controllers/requestController';
import { validateToken } from '../common/tokenvalidator';


const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/createRequest', asyncHandler(validateToken), asyncHandler(createRequest));
router.get('/pendingrequests',asyncHandler(validateToken),  asyncHandler(pendingrequests));
router.post('/assignAmbulanceanddriver',asyncHandler(validateToken),  asyncHandler(assignAmbulanceanddriver));
router.post('/updatetripdetails',asyncHandler(validateToken),  asyncHandler(updatetrip));

router.get('/completedtrips',asyncHandler(validateToken),  asyncHandler(completedtrips));

router.get('/mytrips',asyncHandler(validateToken),  asyncHandler(mytrips));






export default router;