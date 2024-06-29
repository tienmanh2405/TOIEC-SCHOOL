import express from 'express';
import {
    getBaiKiemTras,
    getBaiKiemTraByMaBaiKiemTra,
    createBaiKiemTra,
    deleteBaiKiemTra,
    updateBaiKiemTra
} from '../controllers/baikiemtra.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getBaiKiemTras);

router.get('/:MaBaiKiemTra', getBaiKiemTraByMaBaiKiemTra);

router.post('/create', createBaiKiemTra);

router.delete('/delete/:MaBaiKiemTra', verify, deleteBaiKiemTra);

router.put('/update/:MaBaiKiemTra', verify, updateBaiKiemTra);

export default router;
