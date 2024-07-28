import express from 'express';
import {
    getBaiGiangs,
    getBaiGiangByMaKhoaHoc,
    createBaiGiang,
    deleteBaiGiang,
    updateBaiGiang
} from '../controllers/baigiang.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getBaiGiangs);

router.get('/:MaKhoaHoc', getBaiGiangByMaKhoaHoc);

router.post('/create',verify, createBaiGiang);
        
router.delete('/delete/:MaBaiGiang', verify, deleteBaiGiang);

router.put('/update/:MaBaiGiang', verify, updateBaiGiang);

export default router;
