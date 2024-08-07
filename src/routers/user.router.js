import express from 'express';
import {createUser, deleteUser, getUsers,getUserById, login, requestRefreshToken, updateUser} from '../controllers/user.controller.js';
import  {verify} from '../middlewares/verifytoken.middleware.js';
import {validation} from '../middlewares/validation.middleware.js';
import { register as registerSchema, login as loginSchema } from '../validations/auth.validation.js';
import { getHocVienByMaNguoiDung } from '../controllers/hocvien.controller.js';
import { getDangKyHocByMaNguoiDung } from '../controllers/dangkyhoc.controller.js';

const router = express.Router();

router.get('/',getUsers);

router.get('/:MaNguoiDung',getUserById);

router.post('/register',validation(registerSchema),createUser);

router.delete('/delete/:MaNguoiDung',verify, deleteUser);

router.put('/update/:MaNguoiDung',verify,updateUser);

router.post('/login',validation(loginSchema), login);

router.post('/auth/refresh-token', requestRefreshToken);

router.get('/hocvien/:MaNguoiDung', getHocVienByMaNguoiDung);

router.get('/dangkyhoc/:MaNguoiDung', getDangKyHocByMaNguoiDung);
export default router;