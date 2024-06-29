import express from 'express';
import { createHocVien, getHocViens, getHocVienById, updateHocVien } from '../controllers/hocvien.controller.js';

const router = express.Router();

router.post('/', createHocVien);
router.get('/', getHocViens);
router.get('/:MaHocVien', getHocVienById);
router.put('/:MaHocVien', updateHocVien);

export default router;
