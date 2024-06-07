import express from 'express';
import { getLopHocs, getLopHocById, createLopHoc, updateLopHoc, deleteLopHoc } from '../controllers/lophoc.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getLopHocs);
router.get('/:id', getLopHocById);

//admin mới có quyền update, delete,create
router.post('/create',verify, createLopHoc);
router.put('/update/:id',verify, updateLopHoc);
router.delete('/delete/:id',verify, deleteLopHoc);

export default router;
