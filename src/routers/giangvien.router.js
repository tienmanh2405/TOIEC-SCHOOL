import express from 'express';
import { getGiangVienById,  requestRefreshTokenGiangVien, updateGiangVien } from '../controllers/giangvien.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema, login as loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

// Get giangvien by ID
router.get('/:MaQuanLy',verify, getGiangVienById);

// Update a giangvien by ID (requires authentication)
router.put('/update/:MaQuanLy', verify, updateGiangVien);

// Request a new access token using a refresh token
router.post('/auth/refresh-token', requestRefreshTokenGiangVien);

export default router;
