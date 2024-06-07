import express from 'express';
import { login } from '../controllers/quanly.controller.js';
import { login as loginSchema } from '../validations/auth.validation.js';
import { validation } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/login', validation(loginSchema), login);

export default router;
