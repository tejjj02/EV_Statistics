import { Router } from 'express';
import { getStatistics } from '../controllers/statisticsController';

const router = Router();

router.get('/', getStatistics);

export const statisticsRouter = router;