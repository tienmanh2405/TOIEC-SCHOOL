import express from 'express';
import { getLichHocs, getLichHocById, createLichHoc, updateLichHoc, deleteLichHoc } from '../controllers/lichhoc.controller.js';

const router = express.Router();

router.get('/', getLichHocs);
router.get('/:id', getLichHocById);
router.post('/', createLichHoc);
router.put('/:id', updateLichHoc);
router.delete('/:id', deleteLichHoc);

export default router;
