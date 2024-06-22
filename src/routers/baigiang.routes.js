import express from 'express';
import {
    getBaiGiangs,
    getBaiGiangById,
    createBaiGiang,
    deleteBaiGiang,
    updateBaiGiang
} from '../controllers/baigiang.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getBaiGiangs);

router.get('/:MaBaiGiang', getBaiGiangById);

router.post('/create', createBaiGiang);

router.delete('/delete/:MaBaiGiang', verify, deleteBaiGiang);

router.put('/update/:MaBaiGiang', verify, updateBaiGiang);

export default router;
