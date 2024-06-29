import express from 'express';
import { createBuoiHoc, getBuoiHocs, getBuoiHocById } from '../controllers/buoihoc.controller.js';

const router = express.Router();

router.post('/', createBuoiHoc);
router.get('/', getBuoiHocs);
router.get('/:MaBuoiHoc', getBuoiHocById);

export default router;
