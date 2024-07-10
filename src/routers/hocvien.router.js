import express from 'express';
import { createHocVien, getHocViens,getHocVienById, getHocVienByMaLopHoc, updateHocVien, deleteHocVien, updateHocVienByQuanLy } from '../controllers/hocvien.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.post('/', createHocVien);
router.get('/', getHocViens);
router.get('/lophoc/:MaLopHoc',verify, getHocVienByMaLopHoc);
router.get('/:MaHocVien', getHocVienById);
router.put('/:MaHocVien', updateHocVien);
router.put('/quanly/:MaHocVien', updateHocVienByQuanLy);
router.put('/:MaHocVien',verify, updateHocVien); // chi giao vien va admin ms co quyen
router.delete('/delete/:MaHocVien',verify, deleteHocVien); // chi admin ms co quyen

export default router;
