import express from 'express';
import { getDangKyHocs, getDangKyHocById, createDangKyHoc, updateDangKyHoc, deleteDangKyHoc, createPaymentIntent } from '../controllers/dangkyhoc.controller.js';

const router = express.Router();

router.get('/', getDangKyHocs);
router.get('/:id', getDangKyHocById);
router.post('/', createDangKyHoc);
router.post('/payment-intent', createPaymentIntent); 
router.put('/:id', updateDangKyHoc);
router.delete('/:id', deleteDangKyHoc);

export default router;
