import express from 'express';
import { createDiemDanh, getDiemDanhs, getDiemDanhByMaLopHoc } from '../controllers/diemdanh.controller.js';

const router = express.Router();

router.post('/', createDiemDanh);
router.get('/', getDiemDanhs);
router.get('/:MaLopHoc', getDiemDanhByMaLopHoc);

export default router;
