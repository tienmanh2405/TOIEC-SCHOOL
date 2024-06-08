import express from 'express';
import { getKhoaHocs, getKhoaHocById, createKhoaHoc, updateKhoaHoc, deleteKhoaHoc } from '../controllers/khoahoc.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getKhoaHocs);
router.get('/:id', getKhoaHocById);


//admin mới có quyền update, delete,create
router.post('/create',verify, createKhoaHoc);
router.put('/update/:id',verify, updateKhoaHoc);
router.delete('/delete/:id',verify, deleteKhoaHoc);

export default router;
