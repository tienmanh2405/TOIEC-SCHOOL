import express from 'express';
import {
    getBaiKiemTras,
    getBaiKiemTraByMaKhoaHoc,
    createBaiKiemTra,
    deleteBaiKiemTra,
    updateBaiKiemTra
} from '../controllers/baikiemtra.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getBaiKiemTras);

router.get('/:MaBaiKiemTra', getBaiKiemTraByMaKhoaHoc);

router.post('/create', createBaiKiemTra);

router.delete('/delete/:MaBaiKiemTra', verify, deleteBaiKiemTra);

router.put('/update/:MaBaiKiemTra', verify, updateBaiKiemTra);

export default router;
