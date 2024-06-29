import express from 'express';
import { createBuoiHoc, getBuoiHocs, getBuoiHocByMaLopHoc } from '../controllers/buoihoc.controller.js';

const router = express.Router();

router.post('/', createBuoiHoc);
router.get('/', getBuoiHocs);
router.get('/:MaLopHoc', getBuoiHocByMaLopHoc);

export default router;
