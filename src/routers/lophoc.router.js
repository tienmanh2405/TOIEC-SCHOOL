import express from 'express';
import { getLopHocs,getLopHocByMaHocVien, getLopHocByMaGiangVien, createLopHoc, updateLopHoc, deleteLopHoc } from '../controllers/lophoc.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getLopHocs);

router.get('/giangvien/:MaGiangVien',verify, getLopHocByMaGiangVien);
router.get('/hocvien/:MaNguoiDung', getLopHocByMaHocVien);
//admin mới có quyền update, delete,create
router.post('/create',verify, createLopHoc);
router.put('/update/:id',verify, updateLopHoc);
router.delete('/delete/:id',verify, deleteLopHoc);

export default router;
