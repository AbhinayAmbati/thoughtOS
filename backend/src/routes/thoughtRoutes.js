import express from 'express';
import { processThought, getThoughts } from '../controllers/thoughtController.js';

const router = express.Router();

router.post('/compile', processThought);
router.get('/', getThoughts);

export default router;
