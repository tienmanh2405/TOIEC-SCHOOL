import express from 'express';
import { createDiemDanh, getDiemDanhs, getDiemDanhById } from '../controllers/diemdanh.controller.js';

const router = express.Router();

router.post('/', createDiemDanh);
router.get('/', getDiemDanhs);
router.get('/:MaDiemDanh', getDiemDanhById);

export default router;
