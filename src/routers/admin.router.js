import express from 'express';
import { createAdmin, deleteAdmin, getAdmins, getAdminById, requestRefreshTokenAdmin, updateAdmin, createGiangVien } from '../controllers/admin.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';
import { validation } from '../middlewares/validation.middleware.js';
import { register as registerSchema} from '../validations/auth.validation.js';

const router = express.Router();

// Get admins
router.get('/',verify, getAdmins);
// Get admin by ID
router.get('/:MaQuanLy',verify, getAdminById);
// Register a new admin
router.post('/register-admin', validation(registerSchema),verify , createAdmin);
// Delete an admin by ID (requires authentication)
router.delete('/delete/:MaQuanLy', verify, deleteAdmin);
// Update an admin by ID (requires authentication)
router.put('/update/:MaQuanLy', verify, updateAdmin);
// Request a new access token using a refresh token
router.post('/auth/refresh-token', requestRefreshTokenAdmin);

// Register a new giangvien
router.post('/register-giangvien', validation(registerSchema),verify , createGiangVien);

export default router;
