import express from 'express';
import { getKhoaHocs, getKhoaHocById, createKhoaHoc, updateKhoaHoc, deleteKhoaHoc } from '../controllers/khoahoc.controller.js';

const router = express.Router();

router.get('/', getKhoaHocs);
router.get('/:id', getKhoaHocById);
router.post('/', createKhoaHoc);
router.put('/:id', updateKhoaHoc);
router.delete('/:id', deleteKhoaHoc);

export default router;
