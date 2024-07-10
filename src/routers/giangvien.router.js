import express from 'express';
import { getGiangVienById,  requestRefreshTokenGiangVien, updateGiangVien} from '../controllers/giangvien.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';
import { getLopHocByMaGiangVien, getBuoiHocByMaLopHoc } from '../controllers/lophoc.controller.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema, login as loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

// Get giangvien by ID
router.get('/:MaQuanLy',verify, getGiangVienById);

// Update a giangvien by ID (requires authentication)
router.put('/update/:MaQuanLy', verify, updateGiangVien);

// Request a new access token using a refresh token
router.post('/auth/refresh-token', requestRefreshTokenGiangVien);

router.get('/lichhoc/:MaQuanLy',verify, getLopHocByMaGiangVien);

router.get('/lophoc/buoihoc/:MaLopHoc',verify, getBuoiHocByMaLopHoc);
export default router;
