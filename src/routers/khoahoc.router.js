import express from 'express';
import { getKhoaHocs, getKhoaHocById, createKhoaHoc, updateKhoaHoc, deleteKhoaHoc } from '../controllers/khoahoc.controller.js';

const router = express.Router();

router.get('/', getKhoaHocs);
router.get('/:id', getKhoaHocById);


//admin mới có quyền update, delete,create
router.post('/create/', createKhoaHoc);
router.put('/update/:id', updateKhoaHoc);
router.delete('/delete/:id', deleteKhoaHoc);

export default router;
