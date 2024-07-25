import express from 'express';
import { getDangKyHocs, getDangKyHocByMaNguoiDung, createDangKyHoc, updateDangKyHoc, deleteDangKyHoc, createPaymentIntent } from '../controllers/dangkyhoc.controller.js';

const router = express.Router();

router.get('/', getDangKyHocs);
router.get('/:MaNguoiDung', getDangKyHocByMaNguoiDung);
router.post('/create', createDangKyHoc);
router.post('/payment', createPaymentIntent); 
router.put('/update/:id', updateDangKyHoc);
router.delete('/delete/:id', deleteDangKyHoc);

export default router;  
    