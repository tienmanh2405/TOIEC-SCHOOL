import express from 'express';
import {
    getChiTietBaiGiangs,
    createChiTietBaiGiang,
    deleteChiTietBaiGiang,
    updateChiTietBaiGiang,
    getChiTietBaiGiangByMaBaiGiang
} from '../controllers/chitietbaigiang.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getChiTietBaiGiangs);

router.get('/:MaBaiGiang', getChiTietBaiGiangByMaBaiGiang);

router.post('/create',createChiTietBaiGiang);

router.delete('/delete/:MaChiTiet', verify, deleteChiTietBaiGiang); 

router.put('/update/:MaChiTiet', verify, updateChiTietBaiGiang);

export default router;
