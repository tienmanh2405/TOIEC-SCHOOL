import express from 'express';
import { getDangKyHocs, getDangKyHocById, createDangKyHoc, updateDangKyHoc, deleteDangKyHoc, createPaymentIntent } from '../controllers/dangkyhoc.controller.js';

const router = express.Router();

router.get('/', getDangKyHocs);
router.get('/:id', getDangKyHocById);
router.post('/create', createDangKyHoc);
router.post('/payment-intent', createPaymentIntent); 
router.put('/update/:id', updateDangKyHoc);
router.delete('/delete/:id', deleteDangKyHoc);

export default router;
