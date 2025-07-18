import { Router } from 'express';
import { handleIdentify } from '../controllers/contactController';

const router = Router();

router.post('/identify', handleIdentify);

export default router;