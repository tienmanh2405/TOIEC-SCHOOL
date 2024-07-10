import express from 'express';
import { createDiemDanh, getDiemDanhs, getDiemDanhByMaLopHoc, updateDiemDanh } from '../controllers/diemdanh.controller.js';

const router = express.Router();

router.post('/', createDiemDanh);
router.get('/', getDiemDanhs);
router.get('/:MaLopHoc', getDiemDanhByMaLopHoc);
router.put('/:MaLopHoc', updateDiemDanh);

export default router;
